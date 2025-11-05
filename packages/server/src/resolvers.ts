import { randomUUID } from "crypto";
import {
  Animal,
  AuthPayload,
  MutationCreateAnimalArgs,
  MutationEditAnimalArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  User,
  MutationDeleteAnimalArgs,
  HomeData,
} from "../../shared/generated/graphql-types";
import { Context } from "./index";
// import { sendWelcomeEmail } from "./libs/mailer";
import { createJWT, hashPassword, verifyPassword } from "./utils/auth";
import { prisma } from "./prisma/client";
import { calculateDistanceKm } from "./utils/distance";

export const resolvers = {
  Query: {
    me: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<User | null> => {
      if (!context.user) throw new Error("Not authenticated");

      const me = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: { location: true },
      });

      return me;
    },
    homeData: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<HomeData> => {
      if (!context.user) throw new Error("Not authenticated");

      // Récupère l'utilisateur
      const me = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: { location: true },
      });

      if (!me) throw new Error("User not found");

      // Récupère les animaux de l'utilisateur
      const myAnimalsData = await prisma.animal.findMany({
        where: { ownerId: context.user.id },
        include: { owner: { include: { location: true } } },
      });

      // Récupère les animaux disponibles et en recherche
      const availableAnimalsData = await prisma.animal.findMany({
        where: { breedingStatus: "AVAILABLE" },
        include: { owner: { include: { location: true } } },
      });

      const lookingAnimalsData = await prisma.animal.findMany({
        where: { breedingStatus: "LOOKING" },
        include: { owner: { include: { location: true } } },
      });

      const filterOwner = (animals: typeof availableAnimalsData) =>
        animals.filter((a) => a.ownerId !== context.user?.id);

      const mapAnimal = (
        animal: (typeof availableAnimalsData)[number]
      ): Animal & { distance?: number } => {
        let distance: number | undefined = undefined;
        if (me.location && animal.owner.location) {
          distance = calculateDistanceKm(
            me.location.latitude,
            me.location.longitude,
            animal.owner.location.latitude,
            animal.owner.location.longitude
          );
        }

        return {
          id: animal.id,
          name: animal.name,
          species: animal.species,
          breed: animal.breed,
          age: animal.age,
          description: animal.description,
          sex: animal.sex,
          breedingStatus: animal.breedingStatus,
          distance,
          owner: {
            id: animal.owner.id,
            email: animal.owner.email,
            username: animal.owner.username,
            location: animal.owner.location
              ? {
                  latitude: animal.owner.location.latitude,
                  longitude: animal.owner.location.longitude,
                }
              : null,
          },
          createdAt: animal.createdAt.toISOString(),
        };
      };

      return {
        me: {
          id: me.id,
          email: me.email,
          username: me.username,
          location: me.location
            ? {
                latitude: me.location.latitude,
                longitude: me.location.longitude,
              }
            : null,
        },
        myAnimals: myAnimalsData.map(mapAnimal),
        availableAnimals: filterOwner(availableAnimalsData).map(mapAnimal),
        lookingAnimals: filterOwner(lookingAnimalsData).map(mapAnimal),
      };
    },

    myAnimals: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<Animal[]> => {
      if (!context.user) throw new Error("Not authenticated");
      const ownerAnimals = await prisma.animal.findMany({
        where: { ownerId: context.user.id },
        include: { owner: { include: { location: true } } },
      });

      const mappedAnimals: Animal[] = ownerAnimals.map((prismaAnimal) => ({
        id: prismaAnimal.id,
        name: prismaAnimal.name,
        species: prismaAnimal.species,
        breed: prismaAnimal.breed,
        age: prismaAnimal.age,
        description: prismaAnimal.description,
        sex: prismaAnimal.sex,
        breedingStatus: prismaAnimal.breedingStatus,
        owner: {
          id: prismaAnimal.owner.id,
          email: prismaAnimal.owner.email,
          username: prismaAnimal.owner.username,
          location: prismaAnimal.owner.location
            ? {
                latitude: prismaAnimal.owner.location.latitude,
                longitude: prismaAnimal.owner.location.longitude,
              }
            : null,
        },
        createdAt: prismaAnimal.createdAt.toISOString(),
      }));
      return mappedAnimals;
    },

    availableAnimals: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<Animal[]> => {
      const id = context.user?.id;

      // On récupère les animaux disponibles
      const availableAnimals = await prisma.animal.findMany({
        where: { breedingStatus: "AVAILABLE" },
        include: { owner: { include: { location: true } } },
      });

      // On exclut les animaux de l'utilisateur connecté
      const filteredAnimals = id
        ? availableAnimals.filter((animal) => animal.ownerId !== id)
        : availableAnimals;

      // On récupère la localisation de l'utilisateur connecté
      let userLocation = null;
      if (id) {
        const me = await prisma.user.findUnique({
          where: { id },
          include: { location: true },
        });
        userLocation = me?.location ?? null;
      }

      // On map les animaux avec la distance
      return filteredAnimals.map((prismaAnimal) => {
        let distance: number | null = null;

        if (
          userLocation &&
          prismaAnimal.owner.location &&
          userLocation.latitude !== null &&
          userLocation.longitude !== null
        ) {
          distance = calculateDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            prismaAnimal.owner.location.latitude,
            prismaAnimal.owner.location.longitude
          );
        }

        return {
          id: prismaAnimal.id,
          name: prismaAnimal.name,
          species: prismaAnimal.species,
          breed: prismaAnimal.breed,
          age: prismaAnimal.age,
          description: prismaAnimal.description,
          sex: prismaAnimal.sex,
          breedingStatus: prismaAnimal.breedingStatus,
          distance, // <-- 👈 ajouté ici
          owner: {
            id: prismaAnimal.owner.id,
            email: prismaAnimal.owner.email,
            username: prismaAnimal.owner.username,
            location: prismaAnimal.owner.location
              ? {
                  latitude: prismaAnimal.owner.location.latitude,
                  longitude: prismaAnimal.owner.location.longitude,
                }
              : null,
          },
          createdAt: prismaAnimal.createdAt.toISOString(),
        };
      });
    },

    lookingAnimals: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<Animal[]> => {
      const id = context.user?.id;

      // Récupère tous les animaux "en recherche"
      const lookingAnimals = await prisma.animal.findMany({
        where: { breedingStatus: "LOOKING" },
        include: { owner: { include: { location: true } } },
      });

      // Exclut les animaux de l'utilisateur connecté
      const filteredAnimals = id
        ? lookingAnimals.filter((animal) => animal.ownerId !== id)
        : lookingAnimals;

      // Récupère la localisation de l'utilisateur connecté
      let userLocation = null;
      if (id) {
        const me = await prisma.user.findUnique({
          where: { id },
          include: { location: true },
        });
        userLocation = me?.location ?? null;
      }

      // Map avec calcul de distance
      return filteredAnimals.map((prismaAnimal) => {
        let distance: number | null = null;

        if (
          userLocation &&
          prismaAnimal.owner.location &&
          userLocation.latitude !== null &&
          userLocation.longitude !== null
        ) {
          distance = calculateDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            prismaAnimal.owner.location.latitude,
            prismaAnimal.owner.location.longitude
          );
        }

        return {
          id: prismaAnimal.id,
          name: prismaAnimal.name,
          species: prismaAnimal.species,
          breed: prismaAnimal.breed,
          age: prismaAnimal.age,
          description: prismaAnimal.description,
          sex: prismaAnimal.sex,
          breedingStatus: prismaAnimal.breedingStatus,
          distance, // 👈 ajouté ici
          owner: {
            id: prismaAnimal.owner.id,
            email: prismaAnimal.owner.email,
            username: prismaAnimal.owner.username,
            location: prismaAnimal.owner.location
              ? {
                  latitude: prismaAnimal.owner.location.latitude,
                  longitude: prismaAnimal.owner.location.longitude,
                }
              : null,
          },
          createdAt: prismaAnimal.createdAt.toISOString(),
        };
      });
    },

    getAnimal: async (
      _: unknown,
      args: { id: string },
      context: Context
    ): Promise<(Animal & { distance?: number }) | null> => {
      if (!context.user) throw new Error("Not authenticated");

      const prismaAnimal = await prisma.animal.findUnique({
        where: { id: args.id },
        include: { owner: { include: { location: true } } },
      });

      if (!prismaAnimal) return null;

      // Récupère l'utilisateur avec sa location
      const me = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: { location: true },
      });

      let distance: number | undefined = undefined;
      if (me?.location && prismaAnimal.owner.location) {
        distance = calculateDistanceKm(
          me.location.latitude,
          me.location.longitude,
          prismaAnimal.owner.location.latitude,
          prismaAnimal.owner.location.longitude
        );
      }

      return {
        id: prismaAnimal.id,
        name: prismaAnimal.name,
        species: prismaAnimal.species,
        breed: prismaAnimal.breed,
        age: prismaAnimal.age,
        description: prismaAnimal.description,
        sex: prismaAnimal.sex,
        breedingStatus: prismaAnimal.breedingStatus,
        distance,
        owner: {
          id: prismaAnimal.owner.id,
          email: prismaAnimal.owner.email,
          username: prismaAnimal.owner.username,
          location: prismaAnimal.owner.location
            ? {
                latitude: prismaAnimal.owner.location.latitude,
                longitude: prismaAnimal.owner.location.longitude,
              }
            : null,
        },
        createdAt: prismaAnimal.createdAt.toISOString(),
      };
    },
  },

  Mutation: {
    signup: async (
      _: unknown,
      args: MutationSignupArgs
    ): Promise<AuthPayload> => {
      const { email, password, username, location } = args.input;

      // Vérifie si l'utilisateur existe déjà
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error("Email already used");
        }
        if (existingUser.username === username) {
          throw new Error("Username already taken");
        }
      }

      // Hash du mot de passe
      const hashedPassword = await hashPassword(password);

      // Création de l'utilisateur en DB avec location si elle existe
      const prismaUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          email,
          password: hashedPassword,
          username: username,
          location: location
            ? {
                create: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              }
            : undefined,
        },
        include: { location: true }, // on récupère la location pour le mapping
      });

      // Génération du token JWT
      const token = createJWT(prismaUser.id);

      const gqlCreatedUser: User = {
        id: prismaUser.id,
        email: prismaUser.email,
        username: prismaUser.username,
        location: prismaUser.location
          ? {
              latitude: prismaUser.location.latitude,
              longitude: prismaUser.location.longitude,
            }
          : null,
      };

      return { token, user: gqlCreatedUser };
    },

    login: async (
      _: unknown,
      args: MutationLoginArgs
    ): Promise<AuthPayload> => {
      const { email, password } = args.input;

      // Récupère l'utilisateur depuis la DB avec sa location
      const prismaUser = await prisma.user.findUnique({
        where: { email },
        include: { location: true }, // récupère la location si elle existe
      });

      if (!prismaUser) throw new Error("User not found");

      const valid = await verifyPassword(password, prismaUser.password);
      if (!valid) throw new Error("Invalid password");

      // Génère le token JWT
      const token = createJWT(prismaUser.id);

      // Mapping vers le type GraphQL
      const gqlUser: User = {
        id: prismaUser.id,
        email: prismaUser.email,
        username: prismaUser.username,
        location: prismaUser.location
          ? {
              latitude: prismaUser.location.latitude,
              longitude: prismaUser.location.longitude,
            }
          : null, // null si pas de location
      };

      return { token, user: gqlUser };
    },
    createAnimal: async (
      _: unknown,
      args: MutationCreateAnimalArgs,
      context: Context
    ): Promise<Animal> => {
      if (!context.user) throw new Error("Not authenticated");
      const prismaUser = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: { location: true }, // récupère la location si elle existe
      });
      if (!prismaUser) throw new Error("User not found");

      const { name, sex, age, species, breed, description, breedingStatus } =
        args.input;

      const prismaAnimal = await prisma.animal.create({
        data: {
          name: name,
          sex: sex,
          age: age,
          species: species,
          breed: breed ?? null,
          description: description ?? null,
          breedingStatus: breedingStatus,
          ownerId: prismaUser.id,
        },
      });

      const gqlCreatedAnimal: Animal = {
        id: prismaAnimal.id,
        name: prismaAnimal.name,
        sex: prismaAnimal.sex,
        age: prismaAnimal.age,
        species: prismaAnimal.species,
        breed: prismaAnimal.breed,
        description: prismaAnimal.description,
        breedingStatus: prismaAnimal.breedingStatus,
        owner: {
          id: prismaUser.id,
          email: prismaUser.email,
          username: prismaUser.username,
          location: prismaUser.location
            ? {
                latitude: prismaUser.location.latitude,
                longitude: prismaUser.location.longitude,
              }
            : null,
        },
        createdAt: prismaAnimal.createdAt.toISOString(),
      };
      return gqlCreatedAnimal;
    },
    editAnimal: async (
      _: unknown,
      args: MutationEditAnimalArgs,
      context: Context
    ): Promise<Animal> => {
      if (!context.user) throw new Error("Not authenticated");
      const prismaAnimal = await prisma.animal.findUnique({
        where: { id: args.input.id },
        include: { owner: { include: { location: true } } },
      });
      if (!prismaAnimal) throw new Error("Animal not found");
      if (prismaAnimal.owner.id !== context.user.id)
        throw new Error("Not authorized to edit this animal");

      const { name, sex, age, species, breed, description, breedingStatus } =
        args.input;

      const updatedAnimal = await prisma.animal.update({
        where: { id: prismaAnimal.id },
        data: {
          name: name,
          species: species,
          age: age,
          sex: sex,
          breedingStatus: breedingStatus,
          breed: breed,
          description: description,
        },
        include: { owner: { include: { location: true } } },
      });

      const gqlEditedAnimal: Animal = {
        id: updatedAnimal.id,
        name: updatedAnimal.name,
        sex: updatedAnimal.sex,
        age: updatedAnimal.age,
        species: updatedAnimal.species,
        breed: updatedAnimal.breed,
        description: updatedAnimal.description,
        breedingStatus: updatedAnimal.breedingStatus,
        owner: {
          id: updatedAnimal.owner.id,
          email: updatedAnimal.owner.email,
          username: updatedAnimal.owner.username,
          location: updatedAnimal.owner.location
            ? {
                latitude: updatedAnimal.owner.location.latitude,
                longitude: updatedAnimal.owner.location.longitude,
              }
            : null,
        },
        createdAt: updatedAnimal.createdAt.toISOString(),
      };

      return gqlEditedAnimal;
    },
    deleteAnimal: async (
      _: unknown,
      args: MutationDeleteAnimalArgs,
      context: Context
    ): Promise<Animal> => {
      const { id } = args.input;
      if (!context.user) throw new Error("Not authenticated");

      const prismaAnimal = await prisma.animal.findUnique({
        where: { id },
        include: { owner: true },
      });
      if (!prismaAnimal) throw new Error("Animal not found");
      if (prismaAnimal.owner.id !== context.user.id)
        throw new Error("Not authorized to delete this animal");

      const deletedAnimal = await prisma.animal.delete({
        where: { id },
        include: { owner: { include: { location: true } } },
      });

      const GqlDeletedAnimal: Animal = {
        id: deletedAnimal.id,
        name: deletedAnimal.name,
        sex: deletedAnimal.sex,
        age: deletedAnimal.age,
        species: deletedAnimal.species,
        breed: deletedAnimal.breed,
        description: deletedAnimal.description,
        breedingStatus: deletedAnimal.breedingStatus,
        owner: {
          id: deletedAnimal.owner.id,
          email: deletedAnimal.owner.email,
          username: deletedAnimal.owner.username,
          location: deletedAnimal.owner.location
            ? {
                latitude: deletedAnimal.owner.location.latitude,
                longitude: deletedAnimal.owner.location.longitude,
              }
            : null,
        },
        createdAt: deletedAnimal.createdAt.toISOString(),
      };

      return GqlDeletedAnimal;
    },
  },
};

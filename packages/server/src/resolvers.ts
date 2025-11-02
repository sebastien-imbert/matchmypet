console.log("Resolvers module loaded");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import {
  Animal,
  AuthPayload,
  BreedingStatus,
  MutationCreateAnimalArgs,
  MutationEditAnimalArgs,
  MutationLoginArgs,
  Sex,
  MutationSignupArgs,
  User,
} from "../../shared/generated/graphql-types";
import { Context } from "./index";
import { users, animals } from "./db";
import { sendWelcomeEmail } from "./services/mailer";

export const resolvers = {
  Query: {
    hello: (): string => "Hello world!",

    me: (_: unknown, __: unknown, context: Context): User | null => {
      if (!context.user) throw new Error("Not authenticated");
      return users.find((u) => u.id === context.user?.id) || null;
    },

    myAnimals: (_: unknown, __: unknown, context: Context): Animal[] => {
      if (!context.user) throw new Error("Not authenticated");
      return animals.filter((a) => a.owner.id === context.user!.id);
    },

    availableAnimals: (): Animal[] => {
      return animals.filter((a) => a.breedingStatus === "AVAILABLE");
    },

    lookingAnimals: (): Animal[] => {
      return animals.filter((a) => a.breedingStatus === "LOOKING");
    },

    // todo type ID!
    getAnimal(
      _: unknown,
      args: { id: string },
      context: Context
    ): Animal | null {
      if (!context.user) throw new Error("Not authenticated");
      return animals.find((a) => a.id === args.id) || null;
    },
  },

  Mutation: {
    signup: async (
      _: unknown,
      args: MutationSignupArgs
    ): Promise<AuthPayload> => {
      const existing = users.find((u) => u.email === args.email);
      if (existing) throw new Error("Email already used");

      const hashed = await bcrypt.hash(args.password, 10);
      const newUser: User = {
        id: randomUUID(),
        email: args.email,
      };
      // Si tu veux stocker le password en mémoire temporaire, car pas de clé password dans l'interface User pour des raisons de sécurité
      (newUser as any).password = hashed;

      users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      // sendWelcomeEmail(newUser.email, newUser.id).catch(console.error);

      return { token, user: newUser };
    },

    login: async (
      _: unknown,
      args: MutationLoginArgs
    ): Promise<AuthPayload> => {
      const user = users.find((u) => u.email === args.email);
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(args.password, (user as any).password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    editAnimal: (
      _: unknown,
      args: MutationEditAnimalArgs,
      context: Context
    ): Animal => {
      if (!context.user) throw new Error("Not authenticated");
      const animal = animals.find((a) => a.id === args.input.id);
      if (!animal) throw new Error("Animal not found");
      if (animal.owner.id !== context.user.id)
        throw new Error("Not authorized to edit this animal");

      animal.name = args.input.name;
      animal.species = args.input.species;
      animal.age = args.input.age;
      animal.sex = args.input.sex;
      animal.breedingStatus = args.input.breedingStatus as BreedingStatus;
      animal.breed = args.input.breed ?? null;
      animal.description = args.input.description ?? null;

      return animal;
    },

    createAnimal: (
      _: unknown,
      args: MutationCreateAnimalArgs,
      context: Context
    ): Animal => {
      if (!context.user) throw new Error("Not authenticated");
      const user = users.find((u) => u.id === context.user!.id);
      if (!user) throw new Error("User not found");

      const input = args.input;

      const newAnimal: Animal = {
        id: randomUUID(),
        name: input.name,
        sex: input.sex as Sex,
        age: input.age,
        species: input.species,
        breed: input.breed ?? null,
        description: input.description ?? null,
        breedingStatus: input.breedingStatus as BreedingStatus,
        owner: user,
        createdAt: new Date().toISOString(),
      };

      animals.push(newAnimal);
      return newAnimal;
    },
    deleteAnimal: (
      _: unknown,
      args: { id: string },
      context: Context
    ): Animal => {
      if (!context.user) throw new Error("Not authenticated");

      const animalIndex = animals.findIndex((a) => a.id === args.id);
      if (animalIndex === -1) throw new Error("Animal not found");

      const animal = animals[animalIndex];
      if (animal.owner.id !== context.user.id)
        throw new Error("Not authorized to delete this animal");

      animals.splice(animalIndex, 1);
      return animal;
    },
  },
};

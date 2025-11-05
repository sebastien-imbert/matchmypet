import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Animal } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Nettoyage de la base avant d’insérer
  await prisma.animal.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // Création de quelques utilisateurs
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
        username: "Alice",
        location: {
          create: {
            latitude: 48.8566,
            longitude: 2.3522, // Paris
          },
        },
      },
      include: { location: true },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        password: await bcrypt.hash("password123", 10),
        username: "Bob",
        location: {
          create: {
            latitude: 45.764,
            longitude: 4.8357, // Lyon
          },
        },
      },
      include: { location: true },
    }),
    prisma.user.create({
      data: {
        email: "charlie@example.com",
        password: await bcrypt.hash("password123", 10),
        username: "Charlie",
        location: {
          create: {
            latitude: 43.6047,
            longitude: 1.4442, // Toulouse
          },
        },
      },
      include: { location: true },
    }),
  ]);

  console.log(`👤 ${users.length} utilisateurs créés`);

  // Création de quelques animaux
  const animals: Omit<Animal, "id" | "createdAt">[] = [
    {
      name: "Max",
      sex: "MALE",
      age: 3,
      species: "CHIEN",
      breed: "Labrador",
      description: "Chien joueur et sociable",
      breedingStatus: "AVAILABLE",
      ownerId: users[0].id,
    },
    {
      name: "Luna",
      sex: "FEMALE",
      age: 2,
      species: "CHAT",
      breed: "Chartreux",
      description: "Chat calme et affectueux",
      breedingStatus: "LOOKING",
      ownerId: users[1].id,
    },
    {
      name: "Rocky",
      sex: "MALE",
      age: 4,
      species: "CHIEN",
      breed: "Berger Australien",
      description: "Adore courir et jouer à la balle",
      breedingStatus: "AVAILABLE",
      ownerId: users[2].id,
    },
    {
      name: "Mila",
      sex: "FEMALE",
      age: 1,
      species: "CHAT",
      breed: "Siamois",
      description: "Très câline et curieuse",
      breedingStatus: "LOOKING",
      ownerId: users[0].id,
    },
  ];

  await prisma.animal.createMany({ data: animals });
  console.log(`🐾 ${animals.length} animaux ajoutés !`);

  console.log("✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
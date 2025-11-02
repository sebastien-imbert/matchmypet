import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum Sex {
    MALE
    FEMALE
  }

  type Animal {
    id: ID!
    name: String!
    sex: Sex!
    age: Int!
    species: Species!
    breed: String
    description: String
    breedingStatus: BreedingStatus!
    owner: User!
    createdAt: String!
  }

  enum BreedingStatus {
    NONE # Pas proposé / pas encore décidé
    AVAILABLE # Disponible pour saillie (souvent un mâle)
    LOOKING # Recherche de partenaire (souvent une femelle)
  }

  enum Species {
    CHIEN
    CHAT
  }

  input CreateAnimalInput {
    name: String!
    sex: Sex!
    age: Int!
    species: Species!
    breed: String
    description: String
    breedingStatus: BreedingStatus!
  }

  input EditAnimalInput {
    id: ID!
    name: String!
    sex: Sex!
    age: Int!
    species: Species!
    breed: String
    description: String
    breedingStatus: BreedingStatus!
  }

  input DeleteAnimalInput {
    id: ID!
  }

  type Query {
    hello: String!
    me: User
    myAnimals: [Animal!]! # Récupère les animaux de l'utilisateur connecté
    availableAnimals: [Animal!]! # Tous les animaux proposés en saillie
    lookingAnimals: [Animal!]! # Tous ceux qui recherchent un partenaire
    getAnimal(id: ID!): Animal # Récupère un animal par son ID
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload! # Inscription
    login(email: String!, password: String!): AuthPayload! # Connexion
    createAnimal(input: CreateAnimalInput!): Animal! # Ajouter un animal
    editAnimal(input: EditAnimalInput!): Animal! # Éditer un animal
    deleteAnimal(id: ID!): Animal! # Supprimer un animal
  }
`;

import { gql } from "@apollo/client";

export const GET_ANIMAL = gql`
  query GetAnimal($id: ID!) {
    getAnimal(id: $id) {
      id
      name
      species
      sex
      age
      breed
      description
      breedingStatus
      distance
      createdAt
    }
  }
`;

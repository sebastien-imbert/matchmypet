import { gql } from "@apollo/client";

export const MY_ANIMALS_QUERY = gql`
  query MyAnimals {
    myAnimals {
      id
      name
      species
      age
      sex
      breedingStatus
      description
    }
  }
`;
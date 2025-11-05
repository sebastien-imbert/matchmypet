import { gql } from "@apollo/client";

export const HOME_DATA_QUERY = gql`
  query HomeData {
    homeData {
      me {
        id
        email
        username
        location {
          latitude
          longitude
        }
      }
      myAnimals {
        id
        name
        sex
        age
        species
        breed
        description
        breedingStatus
        owner {
          id
          email
          username
        }
        createdAt
      }
      availableAnimals {
        id
        name
        sex
        age
        species
        breed
        description
        breedingStatus
        createdAt
      }
      lookingAnimals {
        id
        name
        sex
        age
        species
        breed
        description
        breedingStatus
        createdAt
      }
    }
  }
`;

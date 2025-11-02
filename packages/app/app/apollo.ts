import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://192.168.1.40:4000/graphql",
});

const authLink = new SetContextLink(async (prevContext, operation) => {
  const token = await SecureStore.getItemAsync("userToken");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import jwt from "jsonwebtoken";

// 👇 Déclare un type explicite pour le contexte
export interface Context {
  user?: { id: string };
}

async function start() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware<Context>(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || "";
        if (auth.startsWith("Bearer ")) {
          try {
            const decoded = jwt.verify(
              auth.replace("Bearer ", ""),
              process.env.JWT_SECRET || "default_secret"
            ) as {
              id: string;
            };
            return { user: { id: decoded.id } };
          } catch {
            return {};
          }
        }
        return {};
      },
    })
  );

  const port = 4000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${port}/graphql`);
  });
}

start().catch(console.error);

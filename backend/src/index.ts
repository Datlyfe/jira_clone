require("module-alias").addAlias("@", __dirname);
import "dotenv/config";
import "reflect-metadata";
import * as Sentry from "@sentry/node";
import Express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import createDatabaseConnection from "@/database/createConnection";
import { RESOLVERS } from "@/gql";

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

const initExpressGraphql = async () => {
  const schema = await buildSchema({
    resolvers: RESOLVERS,
  }).catch((err) => console.log(err));

  const apolloServer = new ApolloServer({
    schema: schema as GraphQLSchema,
    context: ({ req, res }: any) => ({ req, res }),
    introspection: true,
  });

  const app = Express();

  app.use(cors());
  app.use(Express.urlencoded({ extended: true }));

  app.get("/", (_, res) => {
    throw('a sentry error test')
    res.json({ server: "jira-pi" });
  });

  apolloServer.applyMiddleware({ app });
  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `server started on http://localhost:5000${apolloServer.graphqlPath}`
    );
  });
};

const bootstrap = async (): Promise<void> => {
  await establishDatabaseConnection();
  initExpressGraphql();
  if (process.env.NODE_ENV === "production") {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
  }
};

bootstrap();

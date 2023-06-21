require("module-alias").addAlias("@", __dirname);
import "dotenv/config";
import "reflect-metadata";
import http from "http";
import { init as SentryInit, Handlers as SentryHandlers } from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import Express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import createDatabaseConnection from "@/database/createConnection";
import { RESOLVERS } from "@/gql";
import { apolloServerSentryPlugin } from "@/gql/plugins/sentry";
import { formatError } from "@/errors/gqlError";

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === "production") {
  SentryInit({
    environment: process.env.APP_ENV,
    release: "jira-clone-api",
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new RewriteFrames({
        root: process.cwd(),
      }),
    ],
  });
}

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
    validate: { forbidUnknownValues: false },
  }).catch((err) => console.log(err));

  if (!schema) {
    throw new Error("Could not build graphql schema");
  }

  const app = Express();
  const httpServer = http.createServer(app);

  const gqlServer = new ApolloServer({
    schema,
    formatError,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      apolloServerSentryPlugin,
    ],
    introspection: true,
  });

  await gqlServer.start();

  app.use(SentryHandlers.requestHandler());

  app.use(
    "/graphql",
    cors(),
    Express.json(),
    expressMiddleware(gqlServer, {
      context: async ({ req, res }) => ({ req, res }),
    }),
    SentryHandlers.errorHandler()
  );

  app.get("/", (_, res) => {
    res.json({ server: "jira-clone-api" });
  });

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

const bootstrap = async (): Promise<void> => {
  await establishDatabaseConnection();
  initExpressGraphql();
};

bootstrap();

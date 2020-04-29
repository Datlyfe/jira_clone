require("module-alias").addAlias("@", __dirname);
import "dotenv/config";
import "reflect-metadata";
import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import Express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import createDatabaseConnection from "@/database/createConnection";
import { RESOLVERS } from "@/gql";
import { apolloServerSentryPlugin } from "@/gql/plugins/sentry";

Sentry.init({
  environment: process.env.APP_ENV,
  release: 'jira-clone-api',
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new RewriteFrames({
      root: process.cwd(),
    }) as any,
  ],
});

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
    playground: true,
    introspection: true,
    plugins: [apolloServerSentryPlugin as any],
  });

  const app = Express();

  app.use(Sentry.Handlers.requestHandler());

  app.use(cors());
  app.use(Express.urlencoded({ extended: true }));

  app.get("/", (_, res) => {
    res.json({ server: "jira-clone-api" });
  });

  apolloServer.applyMiddleware({ app });
  app.use(Sentry.Handlers.errorHandler());
  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `server started on http://localhost:5000${apolloServer.graphqlPath}`
    );
  });
};

const bootstrap = async (): Promise<void> => {
  await establishDatabaseConnection();
  initExpressGraphql();
};

bootstrap();

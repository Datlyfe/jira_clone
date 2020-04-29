import * as Sentry from "@sentry/node";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GQLContext } from "@/types/context";
export const apolloServerSentryPlugin:ApolloServerPlugin = {
  requestDidStart() {
    return {
      didEncounterErrors(rc) {
        Sentry.withScope((scope) => {
          scope.addEventProcessor((event) =>
            Sentry.Handlers.parseRequest(event, (rc.context as GQLContext).req)
          );

          scope.setTags({
            graphql: rc.operation?.operation || "parse_err",
            graphqlName:
              (rc.operationName as any) || (rc.request.operationName as any),
          });

          rc.errors.forEach((error) => {
            if (error.path || error.name !== "GraphQLError") {
              scope.setExtras({
                path: error.path,
              });
              Sentry.captureException(error);
            } else {
              scope.setExtras({});
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      },
    };
  },
};

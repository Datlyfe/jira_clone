import { captureException, withScope } from "@sentry/node";
import type { ApolloServerPlugin } from "@apollo/server";

export const apolloServerSentryPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(ctx) {
        if (!ctx.operation) {
          for (const err of ctx.errors) {
            withScope((scope) => {
              scope.setExtra("query", ctx.request.query);
              captureException(err);
            });
          }
          return;
        }

        for (const err of ctx.errors) {
          withScope((scope) => {
            scope.setTag("kind", ctx.operation?.operation ?? "unknown");

            scope.setExtra("query", ctx.request.query);
            scope.setExtra("variables", ctx.request.variables);

            if (err.path) {
              scope.setLevel("debug");
              scope.addBreadcrumb({
                category: "query-path",
                message: err.path.join(" > "),
              });
            }

            const transactionId =
              ctx.request?.http?.headers.get("x-transaction-id");
            if (transactionId) {
              scope.setTransactionName(transactionId);
            }

            captureException(err);
          });
        }
      },
    };
  },
};

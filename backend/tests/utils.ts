import { graphql } from "graphql";
import { buildSchema } from "type-graphql";

import { RESOLVERS } from "../src/gql";
import { signToken } from "../src/utils/authToken";

export const graphqlTestCall = async (
  query: any,
  variables?: any,
  userId: string = ""
) => {
  const schema = await buildSchema({ resolvers: RESOLVERS });
  return graphql(
    schema,
    query,
    undefined,
    {
      req: {
        get() {
          return getAuthHeader(userId);
        }
      },
      res: {}
    },
    variables
  );
};

const getAuthHeader = (userId: string) => {
  if (!userId) return "";
  return `Bearer ${signToken({ sub: userId })}`;
};

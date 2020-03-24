import { verifyToken, getAuthTokenFromRequest } from "@/utils/authToken";
import { InvalidTokenError } from "@/errors";
import { User } from "@/models";
import { MiddlewareFn } from "type-graphql";
import { GQLContext } from "types/context";

export const IsAuth: MiddlewareFn<GQLContext> = async ({ context }, next) => {
  const token = getAuthTokenFromRequest(context.req);
  if (!token) {
    throw new InvalidTokenError("Authentication token not found.");
  }
  const userId = verifyToken(token).sub;
  if (!userId) {
    throw new InvalidTokenError("Authentication token is invalid.");
  }
  const user = await User.findOne(userId);
  if (!user) {
    throw new InvalidTokenError(
      "Authentication token is invalid: User not found."
    );
  }
  context.req.currentUser = user;
  return next();
};

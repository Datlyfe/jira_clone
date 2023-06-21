import { MiddlewareFn } from "type-graphql";
import { CustomError } from "@/errors";
import { GQLContext } from "@/types/context";
import { pick } from "@/utils/javascript";

export const ErrorInterceptor: MiddlewareFn<GQLContext> = async (_, next) => {
  try {
    return await next();
  } catch (error) {
    console.error(error);
    const isErrorSafeForClient = error instanceof CustomError;

    if (isErrorSafeForClient) {
      const { code, message, data, status } = pick(
        error as InstanceType<typeof CustomError>,
        ["message", "code", "status", "data"]
      );

      throw new CustomError(message, code, status, data);
    }

    throw new CustomError(
      "Something went wrong, please contact our support.",
      "INTERNAL_ERROR",
      500,
      {}
    );
  }
};

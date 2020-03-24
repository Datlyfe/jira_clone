import { Resolver, Query, UseMiddleware } from "type-graphql";
import { ErrorInterceptor } from "@/middlewares/errorInterceptor";
import createGuestAccount from "@/database/createGuestAccount";
import { signToken } from "@/utils/authToken";

@Resolver()
class AuthResolver {
  @UseMiddleware([ErrorInterceptor])
  @Query(() => String)
  async createGuestAccount(): Promise<string> {
    const user = await createGuestAccount();
    return signToken({ sub: user.id });
  }
}

export default AuthResolver;

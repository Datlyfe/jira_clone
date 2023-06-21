import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Mutation,
  Arg
} from "type-graphql";
import { GQLContext } from "@/types/context";
import { Project } from "@/models";
import { IsAuth } from "@/middlewares/isAuth";
import { ResolveTime } from "@/middlewares/resolveTime";
import { ErrorInterceptor } from "@/middlewares/errorInterceptor";
import { findEntityOrThrow, updateEntity } from "@/utils/typeorm";
import { ProjectInput } from "@/gql/types";

@Resolver()
class ProjectResolver {
  @UseMiddleware([ResolveTime, IsAuth, ErrorInterceptor])
  @Query(() => Project)
  async getProjectWithUsersAndIssues(@Ctx() ctx: GQLContext): Promise<Project> {
    const project = await findEntityOrThrow(
      Project,
      ctx.req.currentUser.projectId,
      {
        relations: ["issues", "users"]
      }
    );

    return project;
  }

  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Project)
  async updateProject(
    @Ctx() ctx: GQLContext,
    @Arg("project") projectInput: ProjectInput
  ): Promise<Project> {
    const project = await updateEntity(
      Project,
      ctx.req.currentUser.projectId,
      projectInput
    );

    return project;
  }
}

export default ProjectResolver;

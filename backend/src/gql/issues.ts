import {
  Resolver,
  Arg,
  Query,
  Int,
  Mutation,
  UseMiddleware,
  Ctx
} from "type-graphql";
import { Issue } from "@/models";
import {
  findEntityOrThrow,
  createEntity,
  updateEntity,
  deleteEntity
} from "@/utils/typeorm";
import { IsAuth } from "@/middlewares/isAuth";
import { ErrorInterceptor } from "@/middlewares/errorInterceptor";
import { IssueCreateInput, IssueUpdateInput } from "@/gql/types";
import { GQLContext } from "../types/context";

const calculateListPosition = async ({
  projectId,
  status
}: Partial<Issue>): Promise<number> => {
  const issues = await Issue.find({ projectId, status });

  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};

@Resolver()
class IssueResolver {
  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Query(() => [Issue])
  async getProjectIssues(
    @Ctx() ctx: GQLContext,
    @Arg("searchTerm", () => String, { nullable: true })
    searchTerm: string | null
  ): Promise<Issue[]> {
    const { projectId } = ctx.req.currentUser;
    let whereSQL = "issue.projectId = :projectId";

    if (searchTerm) {
      whereSQL +=
        " AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)";
    }

    const issues = await Issue.createQueryBuilder("issue")
      .select()
      .where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
      .getMany();

    return issues;
  }

  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Query(() => Issue)
  async getIssueWithUsersAndComments(
    @Arg("issueId", () => Int) issueId: number
  ): Promise<Issue> {
    const issue = await findEntityOrThrow(Issue, issueId, {
      relations: ["users", "comments", "comments.user"]
    });

    return issue;
  }

  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Issue)
  async createIssue(
    @Arg("issue") issueInput: IssueCreateInput
  ): Promise<Issue> {
    const listPosition = await calculateListPosition(issueInput);
    const issue = await createEntity(Issue, {
      ...issueInput,
      listPosition
    });
    return issue;
  }
  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Issue)
  async updateIssue(
    @Arg("issue") issueInput: IssueUpdateInput,
    @Arg("id") issueId: number
  ): Promise<Issue> {
    const issue = await updateEntity(Issue, issueId, issueInput);
    return issue;
  }
  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Boolean)
  async deleteIssue(@Arg("id") issueId: number): Promise<Boolean> {
    await deleteEntity(Issue, issueId);
    return true;
  }
}

export default IssueResolver;

import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { createEntity, updateEntity, deleteEntity } from "@/utils/typeorm";
import Comment from "@/models/Comment";
import { CommentInput } from "@/gql/types";
import { IsAuth } from "@/middlewares/isAuth";
import { ErrorInterceptor } from "@/middlewares/errorInterceptor";

@Resolver()
class CommentResolver {
  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Comment)
  async createComment(
    @Arg("comment") commentInput: CommentInput
  ): Promise<Comment | null> {
    console.log(commentInput);
    return await createEntity(Comment, commentInput);
  }
  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Comment)
  async updateComment(
    @Arg("id") commentId: string,
    @Arg("comment") commentInput: CommentInput
  ): Promise<Comment> {
    return await updateEntity(Comment, commentId, commentInput);
  }
  @UseMiddleware([IsAuth, ErrorInterceptor])
  @Mutation(() => Comment)
  async deleteComment(@Arg("id") commentId: string): Promise<Comment> {
    return await deleteEntity(Comment, commentId);
  }
}

export default CommentResolver;

import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity
} from "typeorm";
import is from "@/utils/validations";
import { User, Issue } from "@/models";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
class Comment extends BaseEntity {
  static validations = {
    body: [is.required(), is.maxLength(50000)]
  };

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  body: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Field()
  @Column("uuid")
  userId: string;

  @Field()
  @Column("integer")
  issueId: number;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.comments
  )
  user: User;

  @Field(() => Issue)
  @ManyToOne(
    () => Issue,
    issue => issue.comments,
    { onDelete: "CASCADE" }
  )
  issue: Issue;
}

export default Comment;

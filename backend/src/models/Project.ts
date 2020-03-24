import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  Entity
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import is from "@/utils/validations";
import { ProjectCategory } from "@/constants/project";
import { User, Issue } from "@/models";

@ObjectType()
@Entity()
class Project extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    url: is.url(),
    category: [is.required(), is.oneOf(Object.values(ProjectCategory))]
  };

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar")
  name: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { nullable: true })
  url: string | null;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  description: string | null;

  @Field(() => String)
  @Column("varchar")
  category: ProjectCategory;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Field(() => [Issue], { defaultValue: [] })
  @OneToMany(
    () => Issue,
    issue => issue.project
  )
  issues: Issue[];

  @Field(() => [User], { defaultValue: [] })
  @OneToMany(
    () => User,
    user => user.project
  )
  users: User[];
}

export default Project;

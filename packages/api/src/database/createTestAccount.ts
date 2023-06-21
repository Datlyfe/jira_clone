import { Comment, Issue, Project, User } from "@/models";
import { ProjectCategory } from "@/constants/project";
import { IssueType, IssueStatus, IssuePriority } from "@/constants/issue";
import { createEntity } from "@/utils/typeorm";

const seedUsers = (): Promise<User[]> => {
  const users = [
    createEntity(User, {
      email: "rick@jira.guest",
      name: "Rick Sanchez",
      avatarUrl:
        "https://res.cloudinary.com/datlyfe/image/upload/v1583417163/rick_morty/rick_abe7oc.jpg"
    }),
    createEntity(User, {
      email: "morty@jira.guest",
      name: "Morty Smith",
      avatarUrl:
        "https://res.cloudinary.com/datlyfe/image/upload/v1583417163/rick_morty/morty_n3zqiz.jpg"
    })
  ];
  return Promise.all(users);
};

const seedProject = (users: User[]): Promise<Project> =>
  createEntity(Project, {
    name: "Project name",
    url: "https://www.testurl.com",
    description: "Project description",
    category: ProjectCategory.SOFTWARE,
    users
  });

const seedIssues = (project: Project): Promise<Issue[]> => {
  const { users } = project;

  const issues = [
    createEntity(Issue, {
      title: "Issue title 1",
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOWEST,
      listPosition: 1,
      reporterId: users[0].id,
      project
    }),
    createEntity(Issue, {
      title: "Issue title 2",
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.MEDIUM,
      listPosition: 2,
      estimate: 5,
      description: "Issue description 2",
      reporterId: users[0].id,
      users: [users[0]],
      project
    }),
    createEntity(Issue, {
      title: "Issue title 3",
      type: IssueType.STORY,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGH,
      listPosition: 3,
      estimate: 10,
      description: "Issue description 3",
      reporterId: users[0].id,
      users: [users[0], users[1]],
      project
    })
  ];
  return Promise.all(issues);
};

const seedComments = (issue: Issue, user: User): Promise<Comment> =>
  createEntity(Comment, {
    body: "Comment body",
    issueId: issue.id,
    userId: user.id
  });

const createTestAccount = async (): Promise<Array<any>> => {
  const users = await seedUsers();
  const project = await seedProject(users);
  const issues = await seedIssues(project);
  await seedComments(issues[0], project.users[0]);
  return [project, users[0], issues[0]];
};

export default createTestAccount;

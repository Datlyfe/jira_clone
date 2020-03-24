import { Comment, Issue, Project, User } from "@/models";
import { ProjectCategory } from "@/constants/project";
import { IssueType, IssueStatus, IssuePriority } from "@/constants/issue";
import { createEntity } from "@/utils/typeorm";

const seedUsers = (): Promise<User[]> => {
  const users = [
    createEntity(User, {
      email: "berlin@jira.guest",
      name: "Berlin",
      avatarUrl:
        "https://res.cloudinary.com/datlyfe/image/upload/v1583949061/casa%20del%20papel/berlin_tjeb95.jpg"
    }),
    createEntity(User, {
      email: "profesor@jira.guest",
      name: "El Profesor",
      avatarUrl:
        "https://res.cloudinary.com/datlyfe/image/upload/v1583949197/casa%20del%20papel/profesor_dcwdlt.jpg"
    }),
    createEntity(User, {
      email: "tokyo@jira.guest",
      name: "Tokyo",
      avatarUrl:
        "https://res.cloudinary.com/datlyfe/image/upload/v1583949061/casa%20del%20papel/tokyo_eiij3f.jpg"
    }),
    createEntity(User, {
      email: "denver@jira.guest",
      name: "Denver",
      avatarUrl:
        "https://res.cloudinary.com/datlyfe/image/upload/v1583949061/casa%20del%20papel/denver_wntrkk.jpg"
    })
  ];
  return Promise.all(users);
};

const seedProject = (users: User[]): Promise<Project> =>
  createEntity(Project, {
    name: "Money Heist",
    url: "https://www.atlassian.com/software/jira",
    description: "The robbery of the Royal Mint of Spain",
    category: ProjectCategory.MARKETING,
    users
  });

const seedIssues = (project: Project): Promise<Issue[]> => {
  const { users } = project;

  const issues = [
    createEntity(Issue, {
      title: "The rules and guidlines of the heist",
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.HIGH,
      listPosition: 1,
      description: `<h3>These rules <strong>MUST</strong> be followed :</h3><p><br></p><ul><li><strong>No Killing:</strong> We want to appear to be Just Like Robin Hood, we do not intend to hurt anyone</li><li><strong>No Names:</strong> Everyone is nicknamed after a city. do not share you real names with anyone even me</li><li><strong>No Personal Relationships:</strong> this is good for preventing attachments that might compromise the operation</li></ul><p><br></p><h3><u style="background-color: initial;">That's it!</u></h3><h2>💯💯</h2><p><br></p>`,
      estimate: 12,
      timeSpent: 11,
      reporterId: users[1].id,
      project,
      users: [users[0], users[2], users[1], users[3]]
    }),
    createEntity(Issue, {
      title: "This is our escape plan",
      type: IssueType.TASK,
      status: IssueStatus.INPROGRESS,
      priority: IssuePriority.LOW,
      listPosition: 2,
      description: `<h1>⛏️⛏️ We are digging our way out of the bank <strong>⛏️⛏️</strong></h1><p><br></p><p>Moscow and Denver will take care of digging a tunnel into the safe they are the best in the business.</p>`,
      estimate: 8,
      timeSpent: 4,
      reporterId: users[1].id,
      project,
      users: [users[1], users[3]]
    }),
    createEntity(Issue, {
      title: "Print money for a total of 2.4 billion Euros",
      type: IssueType.TASK,
      status: IssueStatus.INPROGRESS,
      priority: IssuePriority.MEDIUM,
      listPosition: 3,
      description: `<h2>💰💰💰 We are making our own money <strong>💰💰💰</strong></h2><p>The plan is not just to rob the bank no no no..., we are going to take the employees hostage and make them print 2.4 billion Euros</p>`,
      estimate: 5,
      timeSpent: 2,
      reporterId: users[1].id,
      project,
      users: [users[2], users[1], users[3]]
    }),
    createEntity(Issue, {
      title: "Couple hostages tried to escape",
      type: IssueType.BUG,
      status: IssueStatus.INPROGRESS,
      priority: IssuePriority.HIGHEST,
      listPosition: 4,
      description: `<h3>The Bastards almost killed me 😠😠</h3><p><br></p><p>Arturo tried escaping with the help of his secretary Mónica Gaztambide</p>`,
      estimate: 10,
      timeSpent: 2,
      reporterId: users[0].id,
      project,
      users: [users[0], users[3]]
    }),
    createEntity(Issue, {
      title: "We are the resistance",
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOW,
      listPosition: 5,
      description: `<h2>They left us no choice but to come and take what's rightfully ours ✊✊✊</h2><p><br></p><p>In this world, everything is governed by balance. There’s what you stand to gain and what you stand to lose. And when you think you’ve got nothing to lose, you become over confident.</p>`,
      estimate: 10,
      timeSpent: 2,
      reporterId: users[1].id,
      project,
      users: [users[0], users[1], users[3]]
    }),
    createEntity(Issue, {
      title: "Try leaving a comment on this issue.",
      type: IssueType.TASK,
      status: IssueStatus.DONE,
      priority: IssuePriority.MEDIUM,
      listPosition: 7,
      description: `<p>Adding comments to an issue is a useful way to record additional detail about an issue, and collaborate with team members. Comments are shown in the&nbsp;<strong>Comments</strong>&nbsp;section when you&nbsp;<a href="https://confluence.atlassian.com/jira064/what-is-an-issue-720416138.html" rel="noopener noreferrer" target="_blank" style="background-color: rgb(255, 255, 255); color: rgb(0, 82, 204);">view an issue</a>.</p><p><br></p><ol><li>Open the&nbsp;<a href="https://confluence.atlassian.com/jira064/what-is-an-issue-720416138.html" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 82, 204);">issue</a>&nbsp;on which to add your comment.</li><li>Click the&nbsp;<strong>Add a comment</strong>&nbsp;button.</li><li>In the&nbsp;<strong>Comment</strong>&nbsp;text box, type your comment</li><li>Click the&nbsp;<strong>Save </strong>button or the <strong>Enter </strong>key to save the comment.</li></ol><p><br></p>`,
      estimate: 10,
      timeSpent: 2,
      reporterId: users[0].id,
      project,
      users: [users[1]]
    }),
    createEntity(Issue, {
      title:
        "Each issue has a single reporter but can have multiple assignees.",
      type: IssueType.STORY,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGH,
      listPosition: 6,
      description: `<h2>Try assigning <u style="background-color: #ff7979;">Denver</u> to this issue. <span style="color: rgb(51, 51, 51);">🤣&nbsp;🤣&nbsp;🤣</span></h2><p><br></p>`,
      estimate: 6,
      timeSpent: 3,
      reporterId: users[1].id,
      project,
      users: [users[1], users[2]]
    })
  ];
  return Promise.all(issues);
};

const seedComments = (issues: Issue[], users: User[]): Promise<Comment[]> => {
  const comments = [
    createEntity(Comment, {
      body: "HAHA HAHA HAHA HAHA...",
      issueId: issues[1].id,
      userId: users[3].id
    }),
    createEntity(Comment, {
      body:
        "The good thing about relationships is that you finally forget how they started.",
      issueId: issues[0].id,
      userId: users[2].id
    }),
    createEntity(Comment, {
      body: "In the end, love is a good reason for everything to fall apart.",
      issueId: issues[0].id,
      userId: users[2].id
    }),
    createEntity(Comment, {
      body: "Love can’t be timed. It has to be lived.",
      issueId: issues[0].id,
      userId: users[0].id
    }),
    createEntity(Comment, {
      body: "We're gonna be RICH 🤑🤑",
      issueId: issues[2].id,
      userId: users[2].id
    }),
    createEntity(Comment, {
      body: "@Denver execute Monica Gaztambide\nmake an example of her",
      issueId: issues[3].id,
      userId: users[0].id
    }),
    createEntity(Comment, {
      body: "That's against the rules i can't do that.",
      issueId: issues[3].id,
      userId: users[3].id
    }),
    createEntity(Comment, {
      body:
        "Una mattina mi sono alzato O bella ciao, bella ciao, bella ciao, ciao, ciao",
      issueId: issues[4].id,
      userId: users[1].id
    }),
    createEntity(Comment, {
      body:
        "O partigiano, portami via O bella ciao, bella ciao, bella ciao, ciao, ciao",
      issueId: issues[4].id,
      userId: users[0].id
    }),
    createEntity(Comment, {
      body:
        "There are people who study years to earn a salary, we only go to study for five months",
      issueId: issues[5].id,
      userId: users[1].id
    }),
    createEntity(Comment, {
      body:
        "As in chess, there are times when it is necessary to sacrifice a piece to win",
      issueId: issues[6].id,
      userId: users[2].id
    })
  ];
  return Promise.all(comments);
};

const createGuestAccount = async (): Promise<User> => {
  const users = await seedUsers();
  const project = await seedProject(users);
  const issues = await seedIssues(project);
  await seedComments(issues, project.users);
  return users[2];
};

export default createGuestAccount;

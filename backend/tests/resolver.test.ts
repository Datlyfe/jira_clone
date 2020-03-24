import { Connection } from "typeorm";
import createTestDatabaseConnection from "../src/database/createTestConnection";
import { graphqlTestCall } from "./utils";
import { User, Issue } from "../src/models";
import { IssueStatus, IssueType, IssuePriority } from "../src/constants/issue";
import createTestAccount from "../src/database/createTestAccount";
let conn: Connection;
// let testProject: Project;
let testUser: User;
let testIssue: Issue;

const currentUser = `
query currentUser{
  currentUser{
    id,
    name,
    email
  }
}`;

const createIssue = `
mutation createIssue($issue:IssueCreateInput!){
  createIssue(issue:$issue){
    id
    title
    type
    status
  }
}`;

const deleteIssue = `
mutation deleteIssue($issueId:Float!){
  deleteIssue(id:$issueId)
}`;

const updateIssue = `
mutation updateIssue($issueId: Float!, $issue: IssueUpdateInput!) {
  updateIssue(id: $issueId, issue: $issue) {
    id
    title
    description
    type
    status
    priority
    listPosition
    createdAt
    updatedAt
    userIds
  }
}`;

beforeAll(async () => {
  conn = await createTestDatabaseConnection();
  const res = await createTestAccount();
  // testProject = a;
  testUser = res[1];
  testIssue = res[2];
});

afterAll(async () => {
  await conn.close();
});

describe("Resolver => User", () => {
  it("Query => currentUser", async () => {
    const response = await graphqlTestCall(currentUser, {}, testUser.id);
    expect(response).toMatchObject({
      data: {
        currentUser: expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          name: expect.any(String)
        })
      }
    });
  });
});

describe("Resolver => Issue", () => {
  it("Mutation => createIssue", async () => {
    const issue = {
      title: "test issue",
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOWEST,
      description: "this a description",
      projectId: 1,
      reporterId: testUser.id,
      userIds: [testUser.id],
      users: [testUser.id].map(id => ({ id }))
    };
    const response = await graphqlTestCall(createIssue, { issue }, testUser.id);
    expect(response).toMatchObject({
      data: {
        createIssue: expect.objectContaining({
          id: "4"
        })
      }
    });
    const dbIssue = await Issue.findOne(4);
    expect(dbIssue).toBeDefined();
    expect(dbIssue).toMatchObject(
      expect.objectContaining({
        id: 4,
        title: issue.title
      })
    );
  });

  it("Mutation => updateIssue", async () => {
    const newIssue = { title: "this is a new issue title" };
    const response = await graphqlTestCall(
      updateIssue,
      { issueId: testIssue.id, issue: newIssue },
      testUser.id
    );
    expect(response).toMatchObject({
      data: {
        updateIssue: {
          id: `${testIssue.id}`,
          title: newIssue.title
        }
      }
    });
  });

  it("Mutation => deleteIssue", async () => {
    const response = await graphqlTestCall(
      deleteIssue,
      { issueId: testIssue.id },
      testUser.id
    );
    expect(response).toMatchObject({
      data: {
        deleteIssue: true
      }
    });
  });
});

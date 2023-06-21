declare namespace Express {
  export interface Request {
    currentUser: import("@/models").User;
  }
}

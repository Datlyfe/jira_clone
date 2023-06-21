import { Request, Response } from "express";
export interface GQLContext {
  req: Request;
  res: Response;
}

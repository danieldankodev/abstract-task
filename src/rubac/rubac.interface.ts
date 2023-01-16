import { Role } from "../user/user.interface";
import { RequestFormatter, UserFormatter } from "../app.interfface";

export interface Request {
  getIpAddress: () => string;
  getPath: () => string;
}

export type Param = {
  Name: string;
  Expression: string;
};

export type Rule = {
  RuleName: string;
  Expression: string;
};

export type WorkFlow = {
  WorkflowID: number;
  WorkflowName: string;
  Path: string;
  Params: Param[];
  Rules: Rule[];
};

export type Variables =
    { [key: string]: string | UserFormatter | RequestFormatter }
export type Operations = { [key: string]: ((...args: string[]) => boolean) }


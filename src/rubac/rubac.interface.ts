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

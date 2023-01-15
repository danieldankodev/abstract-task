import { Role } from './user/user.interface';

export interface Request {
  getIpAddress: () => string;
  getPath: () => string;
}

export interface User {
  getRole: () => Role;
}

import { Role } from './user/user.interface';

export interface UserFormatter {
  getRole: () => Role;
}

export interface RequestFormatter {
  getIpAddress: () => string;
  getPath: () => string;
}

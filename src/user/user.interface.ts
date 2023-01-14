export enum Role {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
  getRole: () => Role;
}

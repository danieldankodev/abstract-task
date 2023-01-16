import { Prisma } from '@prisma/client'

export enum Role {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
  id: number;
  role: Role;
}

export type PrismaUser = {
  id: number;
  userName: string;
  password: string;
  roleId: number;
}

export type PrismaRole = {
  id: number;
  name: string;
}

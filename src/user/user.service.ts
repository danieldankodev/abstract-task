import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaRole, PrismaUser, Role, User } from "./user.interface";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {
  }
  private static formatUser(user: PrismaUser & { role: PrismaRole }): User {
    return {
      id: user.id,
      role: user.role.name as Role,
    }
  }

  public async getUserById(userId: number) {
    const dbUser = await this.prismaService.user.findUnique({ where: { id: userId }, include: { role: true } })
    if (dbUser) {
      return UserService.formatUser(dbUser)
    }
    return null;
  }
}

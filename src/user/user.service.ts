import { Injectable } from '@nestjs/common';
import { Role } from './user.interface';

@Injectable()
export class UserService {
  private static USERS = [
    { id: 1, role: Role.SUPER_ADMIN },
    { id: 2, role: Role.ADMIN },
    { id: 3, role: Role.BASIC },
  ];

  public getUserById(userId: number) {
    return UserService.USERS.find(({ id }) => id === userId);
  }
}

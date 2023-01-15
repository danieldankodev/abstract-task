import { Injectable } from '@nestjs/common';
import { Role, User } from './user.interface';

@Injectable()
export class UserService {
  static USERS: User[] = [
    { id: 1, role: Role.SUPER_ADMIN },
    { id: 2, role: Role.ADMIN },
    { id: 3, role: Role.BASIC },
  ];

  public getUserById(userId: number) {
    return UserService.USERS.find(({ id }) => id === userId);
  }
}

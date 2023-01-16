import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from "../prisma/prisma.module";

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  describe('Get User By Id', () => {
    it('should return user', async () => {
      for (let i = 1; i < 4; i++) {
        const fetchedUser = await userService.getUserById(i);
        expect(fetchedUser).toHaveProperty('id', i);
      }
    });
    it('should return undefined', async () => {
      const fetchedUser = await userService.getUserById(4);

      expect(fetchedUser).toBe(null);
    });
  });
});

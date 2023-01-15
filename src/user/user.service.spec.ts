import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  describe('Get User By Id', () => {
    it('should return user', () => {
      for (let i = 1; i < 4; i++) {
        expect(userService.getUserById(i)).toHaveProperty('id', i);
      }
    });
    it('should return undefined', () => {
      expect(userService.getUserById(4)).toBe(undefined);
    });
  });
});

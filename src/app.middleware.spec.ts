import { Test, TestingModule } from '@nestjs/testing';
import { RubacService } from "./rubac/rubac.service";
import { UserService } from "./user/user.service";
import { AuthMiddleware } from "./app.middleware";
import { HttpException } from "@nestjs/common";
import { RubacModule } from "./rubac/rubac.module";
import { UserModule } from "./user/user.module";
import { Role } from "./user/user.interface";

describe('AuthMiddleware', () => {
  let rubacService: RubacService;
  let userService: UserService;
  let authMiddleware: AuthMiddleware;
  const req = { headers: { 'user-id': 1, 'x-forwarded-for': '100.100.100.100' }, baseUrl: 'admin/profile' };
  const res = { sendStatus: jest.fn() };
  const next = async (error: undefined | HttpException) => {
      return error;
  };


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [RubacModule, UserModule]
    }).compile();

    rubacService = app.get<RubacService>(RubacService);
    userService = app.get<UserService>(UserService);

    authMiddleware = new AuthMiddleware(rubacService, userService);
  });

  describe('Extract rubac service arguments',  () => {
    it('Formatted data should contain', async () => {
      jest.spyOn(userService, 'getUserById').mockImplementation(() => ({ id: 1, role: Role.SUPER_ADMIN }));
      const checkPermission = jest.fn();
      jest.spyOn(rubacService, 'checkPermission').mockImplementation(checkPermission);
      await authMiddleware.use(req, res, next);
      const methodArguments = checkPermission.mock.calls[0];
      expect(methodArguments[0].getRole()).toBe(Role.SUPER_ADMIN);
      expect(methodArguments[1].getIpAddress()).toContain('100.100.100.100');
      expect(methodArguments[1].getPath()).toContain('admin/profile');
    });
  });

  describe('Middleware return', () => {
    it('Next function should be without an error', async () => {
      jest.spyOn(rubacService, 'checkPermission').mockImplementation(() => true);
      const result = await authMiddleware.use(req, res, next);
      await expect(result).toBe(undefined);
    });
    it('Next function should contain an error', async () => {
      jest.spyOn(rubacService, 'checkPermission').mockImplementation(() => false);
      const result = await authMiddleware.use(req, res, next);
      await expect(result).toBeInstanceOf(HttpException);
    });
  });
});

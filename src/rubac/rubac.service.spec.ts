import { Test, TestingModule } from '@nestjs/testing';
import { RubacService } from './rubac.service';
import { Role } from '../user/user.interface';

describe('RubacService', () => {
  let rubacService: RubacService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [RubacService],
    }).compile();

    rubacService = app.get<RubacService>(RubacService);
  });

  const mockedRequest = {
    getIpAddress: jest.fn(),
    getPath: () => 'admin',
  };
  mockedRequest.getIpAddress
      .mockReturnValueOnce('127.0.0.1')
      .mockReturnValueOnce('127.0.0.1')
      .mockReturnValueOnce('100.100.100.1')
      .mockReturnValueOnce('100.100.100.1')
      .mockReturnValueOnce('100.100.100.100')
      .mockReturnValueOnce('100.100.100.200');

  const mockedUser = {
    getRole: jest.fn(),
  };

  mockedUser.getRole
      .mockReturnValueOnce(Role.BASIC)
      .mockReturnValueOnce(Role.ADMIN)
      .mockReturnValueOnce(Role.ADMIN)
      .mockReturnValueOnce(Role.SUPER_ADMIN)
      .mockReturnValueOnce(Role.SUPER_ADMIN)
      .mockReturnValueOnce(Role.SUPER_ADMIN);

  describe('Basic user', () => {
    it('should not gain access (both workflows)', () => {
      expect(rubacService.checkPermission(mockedUser, mockedRequest)).toBe(
        false,
      );
    });
  });

  describe('Admin user (workflow 2)', () => {
    it('should not gain access if ipAddress is not in range', () => {
      expect(rubacService.checkPermission(mockedUser, mockedRequest)).toBe(
        false,
      );
    });
    it('should gain access if ipAddress is in range', () => {
      expect(rubacService.checkPermission(mockedUser, mockedRequest)).toBe(
        true,
      );
    });
  });

  describe('Super admin user', () => {
    it('should gain access if ipAddress is in range (workflow 2)', () => {
      expect(rubacService.checkPermission(mockedUser, mockedRequest)).toBe(
        true,
      );
    });
    it('should gain access if ipAddress is equal to super admin ip address', () => {
      expect(rubacService.checkPermission(mockedUser, mockedRequest)).toBe(
        true,
      );
    });
    it('should not gain access if ip address is not in admin ip range or super admin address', () => {
      expect(rubacService.checkPermission(mockedUser, mockedRequest)).toBe(
        false,
      );
    });
  });
});

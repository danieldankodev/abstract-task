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

  const getPath = () => '/admin/settings';
  const mockedData = [
    {
      request: { getPath, getIpAddress: () => '127.0.0.1' },
      user: { getRole: () => Role.BASIC },
    },
    {
      request: { getPath, getIpAddress: () => '127.0.0.1' },
      user: { getRole: () => Role.SUPER_ADMIN },
    },
    {
      request: { getPath, getIpAddress: () => '100.100.100.1' },
      user: { getRole: () => Role.SUPER_ADMIN },
    },
    {
      request: { getPath, getIpAddress: () => '100.100.100.1' },
      user: { getRole: () => Role.ADMIN },
    },
    {
      request: { getPath, getIpAddress: () => '100.100.100.100' },
      user: { getRole: () => Role.ADMIN },
    },
    {
      request: { getPath, getIpAddress: () => '100.100.100.200' },
      user: { getRole: () => Role.ADMIN },
    },
  ];

  describe('Basic user', () => {
    it('should not gain access (both workflows)', () => {
      expect(
        rubacService.checkPermission(mockedData[0].user, mockedData[0].request),
      ).toBe(false);
    });
  });

  describe('Super admin user (workflow 2)', () => {
    it('should not gain access if ipAddress is not in range', () => {
      expect(
        rubacService.checkPermission(mockedData[1].user, mockedData[1].request),
      ).toBe(false);
    });
    it('should gain access if ipAddress is in range', () => {
      expect(
        rubacService.checkPermission(mockedData[2].user, mockedData[2].request),
      ).toBe(true);
    });
  });

  describe('Admin user', () => {
    it('should gain access if ipAddress is in range (workflow 2)', () => {
      expect(
        rubacService.checkPermission(mockedData[3].user, mockedData[3].request),
      ).toBe(true);
    });
    it('should gain access if ipAddress is equal to specific admin ip address', () => {
      expect(
        rubacService.checkPermission(mockedData[4].user, mockedData[4].request),
      ).toBe(true);
    });
    it('should not gain access if ip address is not in admin ip range or super admin address', () => {
      expect(
        rubacService.checkPermission(mockedData[5].user, mockedData[5].request),
      ).toBe(false);
    });
  });
});

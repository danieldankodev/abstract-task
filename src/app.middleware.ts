import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request as ExpressRequest, Response } from 'express';
import { Role } from './user/user.interface';
import { RubacService } from './rubac/rubac.service';
import { UserService } from './user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly rubacService: RubacService,
    private readonly userService: UserService,
  ) {}

  private extractData(expressRequest: ExpressRequest) {
    const { 'user-id': userId, 'x-forwarded-for': ipAddress  } = expressRequest.headers;
    const user = this.userService.getUserById(parseInt(userId));

    return {
      request: {
        getIpAddress: () => ipAddress,
        getPath: () => expressRequest.baseUrl,
      },
      user: { getRole: () => user?.role || Role.BASIC },
    };
  }

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    const { user, request } = this.extractData(req);
    const hasAccess = this.rubacService.checkPermission(user, request);
    if (hasAccess) {
      return next();
    }
    return next(new HttpException('Not Authorized!', HttpStatus.UNAUTHORIZED));
  }
}

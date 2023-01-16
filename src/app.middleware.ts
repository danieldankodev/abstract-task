import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request as ExpressRequest, Response } from 'express';
import { Role, User } from './user/user.interface';
import { RubacService } from './rubac/rubac.service';
import { UserService } from './user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly rubacService: RubacService,
    private readonly userService: UserService,
  ) {}

  private async extractData(expressRequest: ExpressRequest) {
    let user: User;
    const userId: string | undefined = expressRequest.headers['user-id'];
    const ipAddress: string = expressRequest.headers['x-forwarded-for'] || '0.0.0.0';
    if (userId) {
      user =  await this.userService.getUserById(parseInt(userId));
    }

    return {
      request: {
        getIpAddress: () => ipAddress,
        getPath: () => expressRequest.baseUrl,
      },
      user: { getRole: () => user?.role },
    };
  }

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    const { user, request } = await this.extractData(req);
    const hasAccess = this.rubacService.checkPermission(user, request);
    if (hasAccess) {
      return next();
    }
    return next(new HttpException('Not Authorized!', HttpStatus.UNAUTHORIZED));
  }
}

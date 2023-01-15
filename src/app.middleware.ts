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
import { RequestFormatter, UserFormatter } from "./app.format";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly rubacService: RubacService,
    private readonly userService: UserService,
  ) {}

  private extractData(expressRequest: ExpressRequest) {
    const userId: string | undefined =
      expressRequest.headers['user-id'];
    const ipAddress: string =
        expressRequest.headers['x-forwarded-for'];
    const user = userId && this.userService.getUserById(parseInt(userId));


    return {
      request: new RequestFormatter(ipAddress || '0.0.0.0', expressRequest.baseUrl),
      user: new UserFormatter(user?.role || Role.BASIC),
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

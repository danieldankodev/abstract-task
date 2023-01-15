import { Request, User } from './app.interface';
import { Role } from './user/user.interface';

export class RequestFormatter implements Request {
  constructor(private ipAddress: string, private baseUrl: string) {}

  public getPath() {
    return this.baseUrl;
  }

  public getIpAddress() {
    return this.ipAddress;
  }
}

export class UserFormatter implements User {
  constructor(private role: Role) {}

  public getRole() {
    return this.role;
  }
}

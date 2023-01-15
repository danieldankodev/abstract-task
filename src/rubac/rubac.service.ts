import { Injectable } from '@nestjs/common';
import { Role } from '../user/user.interface';
import { User, Request } from '../app.interface';

@Injectable()
export class RubacService {
  private static ALL_ADMIN_ROLES = [Role.ADMIN, Role.SUPER_ADMIN];
  private static ADMIN_IP = '100.100.100.100';
  private static ADMIN_IP_RANGE = '100.100.100.1/28';

  private static isIpAllowedForAdmin(valueToFind: string) {
    const partsOfExpectedRange = RubacService.ADMIN_IP_RANGE.split('.');
    const rangePart = partsOfExpectedRange.pop();
    const staticPartOfIp = partsOfExpectedRange.join('.').concat('.');
    if (!valueToFind.includes(staticPartOfIp)) {
      return false;
    }
    const [rangeFrom, rangeTo] = rangePart.split('/');

    let isInRange = false;
    for (let i: number = parseInt(rangeFrom); i < parseInt(rangeTo); i++) {
      const valueToCompareTo = staticPartOfIp.concat(i.toString());
      if (valueToFind === valueToCompareTo) {
        isInRange = true;
        break;
      }
    }

    return isInRange;
  }

  public checkPermission(user: User, request: Request) {
    const userRole = user.getRole();
    const ipAddress = request.getIpAddress();
    if (RubacService.ALL_ADMIN_ROLES.includes(userRole)) {
      if (
        ipAddress === RubacService.ADMIN_IP &&
        userRole === Role.ADMIN
      ) {
        return true;
      }

      return RubacService.isIpAllowedForAdmin(ipAddress);
    }

    return false;
  }
}

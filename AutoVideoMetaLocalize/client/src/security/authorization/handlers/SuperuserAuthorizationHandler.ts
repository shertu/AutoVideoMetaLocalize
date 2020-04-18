import {AuthorizationHandler} from '../framework/authorization-handler';
import {AuthorizationRequirement} from '../framework/authorization-requirement';
import { AuthorizationUser } from '../framework/authorization-user';
import { ClaimTypes } from '..';

export class SuperuserAuthorizationHandler extends AuthorizationHandler {
  private static superusers: string[] = [
    '112088567581740211952',
  ];

  async handleAsync(requirement: AuthorizationRequirement, user: AuthorizationUser, resource: object): Promise<boolean> {
    if (user) {
      return SuperuserAuthorizationHandler.superusers.includes(
          user.findFirstValue(ClaimTypes.NameIdentifier));
    }

    return false;
  }
}

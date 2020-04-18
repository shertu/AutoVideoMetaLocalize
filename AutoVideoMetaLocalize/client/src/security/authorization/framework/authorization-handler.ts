import {AuthorizationRequirement} from './authorization-requirement';
import {AuthorizationUser} from './authorization-user';

export abstract class AuthorizationHandler {
  abstract handleAsync(
    requirement: AuthorizationRequirement,
    user: AuthorizationUser,
    resource: object
  ): Promise<boolean>;
}

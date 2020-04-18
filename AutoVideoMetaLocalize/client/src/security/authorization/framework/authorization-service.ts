import { AuthorizationRequirement } from './authorization-requirement';
import { AuthorizationHandler } from './authorization-handler';
import { SuperuserAuthorizationHandler } from '../handlers';
import { AuthorizationUser } from './authorization-user';

const AUTHORIZATION_HANDLERS: AuthorizationHandler[] = [
  new SuperuserAuthorizationHandler(),
];

export class AuthorizationService {
  /**
   * Checks if a user is authorized to access a resource.
   */
  static async authorizeAsync(
    user: AuthorizationUser,
    resource: object,
    ...requirements: AuthorizationRequirement[]
  ): Promise<boolean> {
    // for each handler
    for (let i = 0; i < AUTHORIZATION_HANDLERS.length; i++) {
      const handler: AuthorizationHandler = AUTHORIZATION_HANDLERS[i];

      // for each unauthorized requirement
      let requirementIndex = 0;
      while (requirementIndex < requirements.length) {
        const requirement: AuthorizationRequirement = requirements[requirementIndex];
        const res: boolean = await handler.handleAsync(requirement, user, resource);
        // console.log('authorization service', handler, requirement, res);
        res ? requirements.splice(requirementIndex) : requirementIndex++;
      }
    }

    return requirements.length === 0;
  }
}

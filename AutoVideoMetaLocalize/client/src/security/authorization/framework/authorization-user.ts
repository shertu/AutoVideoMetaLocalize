import {ClaimTypes} from '..';
import {ApplicationUserRolesApi, Claim, ApplicationUserClaim} from '../../../generated-sources/openapi';

const APPLICATION_USER_ROLES_API = new ApplicationUserRolesApi();

/**
 * A useful wrapper class for a collection of claims.
 */
export class AuthorizationUser {
  private claims: Claim[] = null;

  /**
   * Instantiates a new authorization user.
   */
  constructor(claims: Claim[]) {
    this.claims = claims;
  }

  /**
   * Finds the value of the first claim of the specified type.
   */
  public findFirstValue(claimType: string): string {
    return this.claims.find((elem) =>
      elem.type == claimType).value;
  }

  /**
   * Finds the first role claim with the specified value.
   */
  public findFirstRoleIndex(role: string): number {
    return this.claims.findIndex((elem) =>
      elem.type == ClaimTypes.Role && elem.value == role,
    );
  }

  /**
   * Evaluates whether the user has the specified role.
   */
  public isInRole(role: string): boolean {
    return this.findFirstRoleIndex(role) >= 0;
  }

  /**
   * Gets the id of the user.
   */
  public findFirstNameIdentifier(): string {
    return this.findFirstValue(ClaimTypes.NameIdentifier);
  }

  /**
   * Adds the specified role server-side.
   */
  public async pushRole(role: string): Promise<void> {
    if (this.isInRole(role)) {
      throw new Error(`Failed to add because the ${role} role conflicted.`);
    }

    const id = this.findFirstNameIdentifier();
    const claim: ApplicationUserClaim = {
      userId: id,
      claimType: ClaimTypes.Role,
      claimValue: role,
    };

    await APPLICATION_USER_ROLES_API.apiApplicationUserRolesPost({
      applicationUserClaim: claim,
    });
  }

  /**
   * Deletes the specified role server-side.
   */
  public async spliceRole(role: string): Promise<void> {
    if (!this.isInRole(role)) {
      throw new Error(`Failed to delete because the ${role} role was not found.`);
    }

    const id = this.findFirstNameIdentifier();
    const claim: ApplicationUserClaim = {
      userId: id,
      claimType: ClaimTypes.Role,
      claimValue: role,
    };

    await APPLICATION_USER_ROLES_API.apiApplicationUserRolesDelete({
      applicationUserClaim: claim,
    });
  }
}

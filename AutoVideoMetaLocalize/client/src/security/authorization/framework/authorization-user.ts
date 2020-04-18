import { ClaimTypes } from "./claim-types";

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
}

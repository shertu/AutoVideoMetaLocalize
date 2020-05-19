import {Claim} from '../../../generated-sources/openapi';
import {CLAIM_TYPES} from './claim-types';

/** A useful wrapper class for a collection of claims. */
export class ClaimsPrinciple {
  private claims: Claim[] = null;

  /**
   * Instantiates a new authorization user.
   *
   * @param {Claim[]} claims
   */
  constructor(claims: Claim[]) {
    this.claims = claims;
  }

  /**
   * Finds the value of the first claim of the specified type.
   *
   * @param {string} claimType
   * @return {string}
   */
  public findValue(claimType: string): string {
    const claim = this.claims.find((elem) => elem.type == claimType);
    return claim?.value;
  }

  /**
   * Finds the first role claim with the specified value.
   *
   * @param {string} value
   * @return {Claim}
   */
  public findRole(value: string): Claim {
    return this.claims.find((elem) =>
      elem.type == CLAIM_TYPES.Role && elem.value == value,
    );
  }

  /**
  * Finds the value of the first name identifier claim of the user.
  *
  * @return {string}
  */
  public findNameIdentifier(): string {
    return this.findValue(CLAIM_TYPES.NameIdentifier);
  }
}

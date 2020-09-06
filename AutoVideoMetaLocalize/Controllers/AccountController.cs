using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase {
		public class GetClaimsPrincipleResult {
			//
			// Summary:
			//     Gets a collection that contains all of the claims from all of the claims identities
			//     associated with this claims principal.
			//
			// Returns:
			//     The claims associated with this principal.
			public IEnumerable<Claim> Claims { get; set; }

			//
			// Summary:
			//     Gets a value that indicates whether the user has been authenticated.
			//
			// Returns:
			//     true if the user was authenticated; otherwise, false.
			public bool IsAuthenticated { get; set; }
		}

		/// <summary>
		/// Gets a representation of the user as a collection of claims.
		/// </summary>
		[HttpGet]
		public ActionResult<GetClaimsPrincipleResult> GetClaimsPrinciple() {
			IEnumerable<Claim> claims = User.Claims.Select(elem => new Claim(
				elem.Type, elem.Value, elem.ValueType, elem.Issuer, elem.OriginalIssuer)
			);

			return new ActionResult<GetClaimsPrincipleResult>(new GetClaimsPrincipleResult {
				Claims = claims,
				IsAuthenticated = User.Identity.IsAuthenticated,
			});
		}
	}
}
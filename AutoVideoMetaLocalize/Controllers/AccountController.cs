using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase {
		/// <summary>
		/// Gets a representation of the user as a collection of claims.
		/// </summary>
		[Authorize]
		[HttpGet]
		public ActionResult<IEnumerable<Claim>> GetClaimsPrinciple() {
			IEnumerable<Claim> claims = User.Claims.Select(elem => new Claim(
				elem.Type, elem.Value, elem.ValueType, elem.Issuer, elem.OriginalIssuer)
			);

			return Ok(claims);
		}
	}
}
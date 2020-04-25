using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCredentialManager {
		private readonly GoogleAuthorizationCodeFlow _flow;
		private readonly IHttpContextAccessor _httpContextAccessor;

		public GoogleCredentialManager(GoogleAuthorizationCodeFlow flow, IHttpContextAccessor httpContextAccessor) {
			_flow = flow;
			_httpContextAccessor = httpContextAccessor;
		}

		[Authorize]
		public async Task<UserCredential> GetUserCredentials() {
			HttpContext httpContext = _httpContextAccessor.HttpContext;
			string userId = httpContext.User.FindFirstValue(AdditionalClaimTypes.TokenResponseKey);

			if (userId == null) {
				throw new Exception("The user has not authenticated via Google sign-in.");
			}

			TokenResponse token = await _flow.LoadTokenAsync(userId, CancellationToken.None);
			return new UserCredential(_flow, userId, token);
		}
	}
}

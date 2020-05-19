using AutoVideoMetaLocalize.Security.Claims;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCredentialManager {
		private readonly GoogleAuthorizationCodeFlow flow;
		private readonly IHttpContextAccessor httpContextAccessor;

		public GoogleCredentialManager(GoogleAuthorizationCodeFlow.Initializer initializer, IHttpContextAccessor httpContextAccessor) {
			flow = new GoogleAuthorizationCodeFlow(initializer);
			this.httpContextAccessor = httpContextAccessor;
		}

		public async Task<UserCredential> LoadUserCredentialsAsync() {
			ClaimsPrincipal user = httpContextAccessor.HttpContext.User;

			string key = user.FindFirstValue(AdditionalClaimTypes.TokenResponseKey);

			if (key == null) {
				throw new Exception("An [Authorize] annotation is missing from this endpoint.");
			}

			TokenResponse token = await flow.LoadTokenAsync(key, CancellationToken.None);
			return new UserCredential(flow, key, token);
		}
	}
}

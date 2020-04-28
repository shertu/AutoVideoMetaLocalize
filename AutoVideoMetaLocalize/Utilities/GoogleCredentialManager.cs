using Google;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.YouTube.v3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
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

		public async Task<UserCredential> LoadUserCredentialsAsync() {
			ClaimsPrincipal user = _httpContextAccessor.HttpContext.User;

			if (user == null) {
				throw new Exception("The endpoint requires the authorization annotation.");
			}

			string key = user.FindFirstValue(AdditionalClaimTypes.TokenResponseKey);

			if (key == null) {
				throw new GoogleApiException(nameof(GoogleCredentialManager), "The authenticated user is missing a google token claim.");
			}

			TokenResponse token = await _flow.LoadTokenAsync(key, CancellationToken.None);
			return new UserCredential(_flow, key, token);
		}

		public async Task<YouTubeService> InitializeYouTubeServiceAsync() {
			UserCredential credential = await LoadUserCredentialsAsync();

			return new YouTubeService(new YouTubeService.Initializer {
				HttpClientInitializer = credential,
				ApplicationName = "Auto Video Meta Localize",
			});
		}
	}
}

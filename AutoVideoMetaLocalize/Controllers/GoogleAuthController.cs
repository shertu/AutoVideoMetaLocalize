using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.Auth.OAuth2.Requests;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class GoogleAuthController : ControllerBase {
		private const string AUTHENTICATION_TYPE = "AutoVideoMetaLocalize";
		private const string SIGN_REDIRECT_URI_KEY = "auth-return-url";
		private const string SIGN_REDIRECT_URI_DEFAULT = "~/";

		private readonly GoogleAuthorizationCodeFlow _flow;

		public GoogleAuthController(GoogleAuthorizationCodeFlow flow) {
			_flow = flow;
		}

		/// <summary>
		/// Gets the redirect uri for the OAuth2 request.
		/// </summary>
		private string OAuthRedirectUri => Url.Action(nameof(GoogleSignIn), null, null, Request.Scheme);

		/// <summary>
		/// Gets or sets the redirect uri for the sign in and sign out actions.
		/// Used to ensure that the uri is a local uri.
		/// </summary>
		public string SignRedirectUri {
			get {
				string uri = Request.Cookies[SIGN_REDIRECT_URI_KEY];
				return Url.IsLocalUrl(uri) ? uri : SIGN_REDIRECT_URI_DEFAULT;
			}

			set {
				if (Url.IsLocalUrl(value)) {
					Response.Cookies.Append(SIGN_REDIRECT_URI_KEY, value);
				}
			}
		}

		/// <summary>
		/// Sets the uri to return to after sign in and sign out.
		/// </summary>
		[HttpPost(nameof(SetSignRedirectUri))]
		public IActionResult SetSignRedirectUri(string uri) {
			if (!Url.IsLocalUrl(uri)) {
				return BadRequest($"{nameof(uri)} is not a valid local uri.");
			}

			SignRedirectUri = uri;
			return Ok();
		}

		/// <summary>
		/// Gets the uri to which to redirect the user to sign-in to.
		/// </summary>
		[HttpGet(nameof(AuthorizationRequestUrl))]
		public ActionResult<string> AuthorizationRequestUrl([FromQuery] string scope) {
			AuthorizationCodeRequestUrl authorizationCodeRequestUrl = _flow.CreateAuthorizationCodeRequest(OAuthRedirectUri);
			authorizationCodeRequestUrl.Scope = scope;
			Uri authorizationUrl = authorizationCodeRequestUrl.Build();
			return Ok(authorizationUrl.AbsoluteUri);
		}

		/// <summary>
		/// A utility class which contains both a token and its user key. 
		/// </summary>
		public class GoogleTokenInformation {
			public readonly TokenResponse token;
			public readonly string key;

			public GoogleTokenInformation(TokenResponse token, string key) {
				this.token = token;
				this.key = key;
			}
		}

		/// <summary>
		/// Handles the OAuth2 callback from the google sign in.
		/// </summary>
		[HttpGet(nameof(GoogleSignIn))]
		public async Task<SignInResult> GoogleSignIn([Required] string code) {
			#region Token
			string userTokenKey = Guid.NewGuid().ToString();
			TokenResponse token = await _flow.ExchangeCodeForTokenAsync(
				userTokenKey, code, OAuthRedirectUri, CancellationToken.None);
			#endregion

			ClaimsPrincipal principal = GenerateClaimsPrinciple(token, userTokenKey);
			AuthenticationProperties authenticationProperties = GenerateAuthenticationProperties(token);
			return new SignInResult(CookieAuthenticationDefaults.AuthenticationScheme, principal, authenticationProperties);
		}

		/// <summary>
		/// Generates an identity for sign-in based on the token response and user token key.
		/// </summary>
		protected ClaimsPrincipal GenerateClaimsPrinciple(TokenResponse token, string userTokenKey) {
			ClaimsIdentity identity = new ClaimsIdentity(AUTHENTICATION_TYPE);
			identity.AddClaim(new Claim(AdditionalClaimTypes.TokenResponseKey, userTokenKey));
			return new ClaimsPrincipal(identity);
		}

		/// <summary>
		/// Generates the properties for authentication based on the token response and sign redirect uri.
		/// </summary>
		private AuthenticationProperties GenerateAuthenticationProperties(TokenResponse token) {
			DateTimeOffset expiresUtc = token.IssuedUtc
				.AddSeconds(token.ExpiresInSeconds ?? (default));

			bool hasRefreshToken = token.RefreshToken != null;

			return new AuthenticationProperties {
				AllowRefresh = hasRefreshToken,
				ExpiresUtc = expiresUtc,
				IsPersistent = true,
				IssuedUtc = token.IssuedUtc,
				RedirectUri = SignRedirectUri,
			};
		}

		/// <summary>
		/// Loads the user's response token from storage.
		/// </summary>
		private async Task<GoogleTokenInformation> GetGoogleTokenInformation() {
			string userTokenKey = User.FindFirstValue(AdditionalClaimTypes.TokenResponseKey);

			if (userTokenKey == null) {
				return null;
			}

			TokenResponse token = await _flow.LoadTokenAsync(userTokenKey, CancellationToken.None);
			return new GoogleTokenInformation(token, userTokenKey);
		}

		/// <summary>
		/// Signs a user out of the application.
		/// </summary>
		[HttpGet(nameof(GoogleSignOut))]
		[Authorize]
		public async Task<SignOutResult> GoogleSignOut() {
			GoogleTokenInformation info = await GetGoogleTokenInformation();
			await _flow.RevokeTokenAsync(info.key, info.token.AccessToken, CancellationToken.None);

			AuthenticationProperties authenticationProperties = GenerateAuthenticationProperties(info.token);
			return new SignOutResult(CookieAuthenticationDefaults.AuthenticationScheme, authenticationProperties);
		}

		/// <summary>
		/// Endpoint to fetch information about the user's auth token.
		/// </summary>
		[HttpGet(nameof(GetTokenInformation))]
		[Authorize]
		public async Task<ActionResult<GoogleTokenInformation>> GetTokenInformation() {
			GoogleTokenInformation info = await GetGoogleTokenInformation();
			return Ok(info);
		}
	}
}

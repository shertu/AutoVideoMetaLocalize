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
using Google.Apis.Auth.OAuth2;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class GoogleAuthController : ControllerBase {
		private const string AUTHENTICATION_TYPE = "AutoVideoMetaLocalize";
		private const string AUTHENTICATION_REDIRECT_URI_KEY = "auth-return-url";
		private const string AUTHENTICATION_REDIRECT_URI_DEFAULT = "~/";

		private readonly GoogleAuthorizationCodeFlow _flow;
		private readonly GoogleCredentialManager _gcm;

		public GoogleAuthController(GoogleAuthorizationCodeFlow flow, GoogleCredentialManager gcm) {
			_flow = flow;
			_gcm = gcm;
		}

		/// <summary>
		/// Gets the redirect uri for the OAuth2 request.
		/// </summary>
		private string OAuthRedirectUri => Url.Action(nameof(GoogleSignIn), null, null, Request.Scheme);

		/// <summary>
		/// Gets or sets the redirect uri for the sign in and sign out actions.
		/// Used to ensure that the uri is a local uri.
		/// </summary>
		public string AuthenticationRedirectUri {
			get {
				string uri = Request.Cookies[AUTHENTICATION_REDIRECT_URI_KEY];
				return Url.IsLocalUrl(uri) ? uri : AUTHENTICATION_REDIRECT_URI_DEFAULT;
			}

			set {
				if (Url.IsLocalUrl(value)) {
					Response.Cookies.Append(AUTHENTICATION_REDIRECT_URI_KEY, value);
				}
			}
		}

		/// <summary>
		/// Sets the uri to return to after sign in and sign out.
		/// </summary>
		[HttpPost("authentication-redirect-uri")]
		public ActionResult<string> SetAuthenticationRedirectUri(string uri) {
			if (!Url.IsLocalUrl(uri)) {
				return BadRequest($"{uri} is not a valid local uri.");
			}

			AuthenticationRedirectUri = uri;
			return Ok(AuthenticationRedirectUri);
		}

		/// <summary>
		/// Gets the uri to which to redirect the user to sign-in to.
		/// </summary>
		[HttpGet("authorization-request-url")]
		public ActionResult<string> GetAuthorizationRequestUrl([FromQuery] string scope) {
			AuthorizationCodeRequestUrl authorizationCodeRequestUrl = _flow.CreateAuthorizationCodeRequest(OAuthRedirectUri);
			authorizationCodeRequestUrl.Scope = scope;
			Uri authorizationUrl = authorizationCodeRequestUrl.Build();
			return authorizationUrl.AbsoluteUri;
		}

		/// <summary>
		/// Handles the OAuth2 callback from the google sign in.
		/// </summary>
		[HttpGet(nameof(GoogleSignIn))]
		public async Task<SignInResult> GoogleSignIn([Required] string code) {
			UserCredential credential = await GenerateUserCredentialFromAuthorizationCode(code);
			ClaimsPrincipal principal = GenerateClaimsPrinciple(credential);
			AuthenticationProperties authenticationProperties = GenerateAuthenticationProperties(credential.Token);
			return new SignInResult(CookieAuthenticationDefaults.AuthenticationScheme, principal, authenticationProperties);
		}

		/// <summary>
		/// Generates user crendentials from a google authorization code.
		/// </summary>
		private async Task<UserCredential> GenerateUserCredentialFromAuthorizationCode(string code) {
			string userTokenKey = Guid.NewGuid().ToString();
			TokenResponse token = await _flow.ExchangeCodeForTokenAsync(
				userTokenKey, code, OAuthRedirectUri, CancellationToken.None);
			UserCredential credential = new UserCredential(_flow, userTokenKey, token);
			return credential;
		}

		/// <summary>
		/// Generates an identity for the http-context sign in.
		/// </summary>
		protected ClaimsPrincipal GenerateClaimsPrinciple(UserCredential credential) {
			ClaimsIdentity identity = new ClaimsIdentity(AUTHENTICATION_TYPE);
			identity.AddClaim(new Claim(AdditionalClaimTypes.TokenResponseKey, credential.UserId));
			return new ClaimsPrincipal(identity);
		}

		/// <summary>
		/// Generates the authentication properties for the http-context sign in.
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
				RedirectUri = AuthenticationRedirectUri,
			};
		}

		/// <summary>
		/// Signs a user out of the application and revokes their Google Auth Token.
		/// </summary>
		[HttpGet(nameof(GoogleSignOut))]
		[Authorize]
		public async Task<SignOutResult> GoogleSignOut() {
			UserCredential credential = await _gcm.GetUserCredentials();
			AuthenticationProperties authenticationProperties = GenerateAuthenticationProperties(credential.Token);
			return new SignOutResult(CookieAuthenticationDefaults.AuthenticationScheme, authenticationProperties);
		}
	}
}

using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.Auth.OAuth2.Requests;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authorization;
using AutoVideoMetaLocalize.Security.Claims;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class GoogleAuthController : ControllerBase {
		private const string AUTHENTICATION_TYPE = "AutoVideoMetaLocalize";
		private const string AUTHENTICATION_REDIRECT_URI_KEY = "AUTHENTICATION_REDIRECT_URI";
		private const string AUTHENTICATION_REDIRECT_URI_DEFAULT = "~/";

		private readonly GoogleAuthorizationCodeFlow _flow;
		private readonly GoogleCredentialManager _gcm;

		public GoogleAuthController(GoogleAuthorizationCodeFlow.Initializer initializer, GoogleCredentialManager gcm) {
			_flow = new GoogleAuthorizationCodeFlow(initializer);
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
				string uri = Url.IsLocalUrl(value) ? value : AUTHENTICATION_REDIRECT_URI_DEFAULT;
				Response.Cookies.Append(AUTHENTICATION_REDIRECT_URI_KEY, uri);
			}
		}

		/// <summary>
		/// Sets the uri to return to after sign in and sign out.
		/// </summary>
		[HttpPost("AuthenticationRedirectUri")]
		public ActionResult<string> SetAuthenticationRedirectUri(string uri) {
			AuthenticationRedirectUri = uri;
			return new ActionResult<string>(AuthenticationRedirectUri);
		}

		/// <summary>
		/// Gets the uri to which to redirect the user to sign-in to.
		/// </summary>
		[HttpGet("AuthorizationCodeRequestUrl")]
		public ActionResult<string> GetAuthorizationCodeRequestUrl(string scope) {
			scope ??= "https://www.googleapis.com/auth/userinfo.profile";
			AuthorizationCodeRequestUrl authorizationCodeRequestUrl = _flow.CreateAuthorizationCodeRequest(OAuthRedirectUri);
			authorizationCodeRequestUrl.Scope = scope;
			Uri authorizationUrl = authorizationCodeRequestUrl.Build();
			return authorizationUrl.AbsoluteUri;
		}

		/// <summary>
		/// Handles the OAuth2 callback from the google sign in.
		/// </summary>
		[HttpGet(nameof(GoogleSignIn))]
		public async Task<IActionResult> GoogleSignIn(string code, string error) {
			if (error is null) {
				UserCredential credential = await GenerateUserCredentialFromAuthorizationCode(code);
				ClaimsPrincipal principal = GenerateClaimsPrinciple(credential);
				AuthenticationProperties authenticationProperties = GenerateAuthenticationProperties(credential.Token);

				await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authenticationProperties);
				return LocalRedirect(AuthenticationRedirectUri);
			} else { 
				return LocalRedirect(AuthenticationRedirectUri);
			}  
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
			};
		}

		/// <summary>
		/// Signs a user out of the application and revokes their Google Auth Token.
		/// </summary>
		[Authorize, HttpGet(nameof(GoogleSignOut))]
		public async Task<IActionResult> GoogleSignOut() {
			UserCredential credential = await _gcm.LoadUserCredentialsAsync();
			AuthenticationProperties authenticationProperties = GenerateAuthenticationProperties(credential.Token);
			await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme, authenticationProperties);
			return LocalRedirect(AuthenticationRedirectUri);
		}
	}
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Requests;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Logging;
using AutoVideoMetaLocalize.Database;
using AutoVideoMetaLocalize.Models;
using Google.Apis.YouTube.v3;
using Google.Apis.Services;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase {
		private const string AUTHENTICATION_TYPE = "AutoVideoMetaLocalize";
		private const string LOCATION_HEADER = "location";
		private const string KEY_RE = "auth-return-url";
		private const string DEFAULT_RETURN_URL = "~/";

		/// <summary>
		/// Gets or sets the scopes which indicate the API access your application is requesting.
		/// See https://developers.google.com/identity/protocols/googlescopes for additional information.
		/// </summary>
		private static readonly string[] _scopes = {
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/youtube.upload",
			"https://www.googleapis.com/auth/youtube",
			"https://www.googleapis.com/auth/cloud-translation",
		};

		/// <summary>
		/// Client credential details for installed and web applications.
		/// </summary>
		private readonly ClientSecrets _secrets;

		/// <summary>
		/// A factory abstraction for a component that can create System.Net.Http.HttpClient
		/// instances with custom configuration for a given logical name.
		/// </summary>
		private readonly IHttpClientFactory _httpClientFactory;

		/// <summary>
		/// Gets the redirect url for the OAuth2 request.
		/// </summary>
		private string OAuthRedirectUri => Url.Action(nameof(GoogleSignIn), null, null, Request.Scheme);

		/// <summary>
		/// Thread-safe OAuth 2.0 authorization code flow that manages and persists end-user credentials.
		/// </summary>
		private readonly GoogleAuthorizationCodeFlow flow;

		/// <summary>
		/// 
		/// </summary>
		private readonly IDataStore dataStore = new FileDataStore(Directory.GetCurrentDirectory());

		public AccountController(
			ClientSecrets secrets,
			IHttpClientFactory httpClientFactory
		) {
			_secrets = secrets;
			_httpClientFactory = httpClientFactory;

			// initialize the flow
			flow = new GoogleAuthorizationCodeFlow(
			new GoogleAuthorizationCodeFlow.Initializer {
				ClientSecrets = _secrets,
				Scopes = _scopes,
			});
		}

		/// <summary>
		/// Gets a representation of the logged in user as a collection of claims.
		/// </summary>
		[Authorize]
		[HttpGet]
		public ActionResult<IEnumerable<Claim>> GetAccount() {
			IEnumerable<Claim> claims = User.Claims.Select(elem => new Claim(
				elem.Type, elem.Value, elem.ValueType, elem.Issuer, elem.OriginalIssuer)
			);

			return Ok(claims);
		}

		/// <summary>
		/// Sets the url to return to after sign in and sign out.
		/// </summary>
		[HttpGet(nameof(Login))]
		public IActionResult Login([FromQuery] string returnUrl) {
			if (!string.IsNullOrEmpty(returnUrl)) {
				if (Url.IsLocalUrl(returnUrl)) {
					Response.Cookies.Append(KEY_RE, returnUrl);
				} else {
					return BadRequest($"The value of {nameof(returnUrl)} is not local.");
				}
			}

			Uri authorizationUrl = flow.CreateAuthorizationCodeRequest(OAuthRedirectUri).Build();
			return Redirect(authorizationUrl.AbsoluteUri);
		}

		/// <summary>
		/// Handles the OAuth2 callback from the google sign in.
		/// </summary>
		/// <param name="code">The Google authorization code.</param>
		[HttpGet("google-signin")]
		public async Task<IActionResult> GoogleSignIn([Required] string code) {
			string guid = Guid.NewGuid().ToString();

			TokenResponse token = await flow.ExchangeCodeForTokenAsync(
				guid, code, OAuthRedirectUri, CancellationToken.None);

			await HttpContextSignIn(token);

			UserCredential userCredential = new UserCredential(flow, guid, token);

			await dataStore.StoreAsync<UserCredential>(guid, userCredential);

			YouTubeService service = new YouTubeService(new BaseClientService.Initializer() {
				HttpClientInitializer = userCredential,
				ApplicationName = "Auto Video Meta Localize",
			});

			string returnUrl = Request.Cookies[KEY_RE];
			return RedirectToReturnUrl(returnUrl);
		}

		/// <summary>
		/// Signs a user in to the application.
		/// </summary>
		/// <param name="token">The Google authentication token.</param>
		private async Task HttpContextSignIn(TokenResponse token) {
			GoogleProfile profile = await GetGoogleProfileAsync(token);
			ClaimsIdentity identity = GetClaimsIdentity(profile);

			AuthenticationProperties authenticationProperties = new AuthenticationProperties {
				AllowRefresh = true,
				ExpiresUtc = token.IssuedUtc
					.AddSeconds((long) token.ExpiresInSeconds),
				IsPersistent = true,
				IssuedUtc = token.IssuedUtc,
				RedirectUri = OAuthRedirectUri,
			};

			await HttpContext.SignInAsync(
				CookieAuthenticationDefaults.AuthenticationScheme,
				new ClaimsPrincipal(identity),
				authenticationProperties);
		}

		/// <summary>
		/// Signs a user out of the application.
		/// </summary>
		[HttpGet(nameof(Logout))]
		public async Task<IActionResult> Logout([FromQuery] string returnUrl) {
			await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
			return RedirectToReturnUrl(returnUrl);
		}

		/// <summary>
		/// Redirects the user to the return url and throws a bad request if the url is not local.
		/// </summary>
		private IActionResult RedirectToReturnUrl(string returnUrl) {
			returnUrl ??= DEFAULT_RETURN_URL;

			try {
				return LocalRedirect(returnUrl);
			} catch (Exception) {
				return BadRequest($"Failed to redirect to {nameof(returnUrl)} because it is not a local url.");
			}
		}

		/// <summary>
		/// Calls the Google API to load information about a Google profile.
		/// </summary>
		/// <param name="token">The access token issued by the authorization server.</param>
		private async Task<GoogleProfile> GetGoogleProfileAsync(TokenResponse token) {
			HttpClient client = _httpClientFactory.CreateClient();
			HttpResponseMessage response = await client.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token.AccessToken}");

			if (response.IsSuccessStatusCode) {
				using Stream stream = await response.Content.ReadAsStreamAsync();
				return await JsonSerializer.DeserializeAsync<GoogleProfile>(stream);
			} else {
				throw new Exception(response.ReasonPhrase);
			}
		}

		/// <summary>
		/// Creates a new identity based on the Google profile with up to date claims.
		/// </summary>
		/// <param name="profile">The Google profile on which to base the identity.</param>
		private ClaimsIdentity GetClaimsIdentity(GoogleProfile profile) {
			ClaimsIdentity identity = new ClaimsIdentity(AUTHENTICATION_TYPE);
			identity.AddClaims(profile.ToClaims());
			return identity;
		}
	}
}

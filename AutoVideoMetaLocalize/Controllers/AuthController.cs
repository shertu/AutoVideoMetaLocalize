using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Requests;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoVideoMetaLocalize.Utilities;

namespace AutoVideoMetaLocalize.Controllers {
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase {
    private const string POST_SIGNIN_REDIRECT_URI_KEY = "POST_SIGNIN_REDIRECT_URI";
    private const string POST_SIGNIN_REDIRECT_URI_DEFAULT = "~/";

    private readonly GoogleAuthorizationCodeFlow _flow;

    public AuthController(GoogleAuthorizationCodeFlow.Initializer initializer) {
      _flow = new GoogleAuthorizationCodeFlow(initializer);
    }

    /// <summary>
    /// Gets the redirect uri for the OAuth 2.0 flow.
    /// </summary>
    private string OAuthRedirectUri => Url.Action(nameof(GoogleOAuthCallback), null, null, Request.Scheme);

    /// <summary>
    /// Gets or sets the redirect uri for after the sign in action.
    /// </summary>
    public string PostSignInRedirectUriCookie {
      get {
        IRequestCookieCollection collection = Request.Cookies;

        if (collection.TryGetValue(POST_SIGNIN_REDIRECT_URI_KEY, out string uri)) {
          if (Url.IsLocalUrl(uri)) {
            return uri;
          }
        }

        return POST_SIGNIN_REDIRECT_URI_DEFAULT;
      }

      set => Response.Cookies.Append(POST_SIGNIN_REDIRECT_URI_KEY, value); // options are automatic from cookie middleware
    }

    /// <summary>
    /// Starts the Google OAuth 2.0 flow by redirecting the user to the Google login page with the specified scopes.
    /// </summary>
    [HttpGet(nameof(GoogleOAuthSignIn))]
    public IActionResult GoogleOAuthSignIn([FromQuery] string? scope, [FromQuery] string? postSignInRedirectUri) {
      PostSignInRedirectUriCookie = postSignInRedirectUri ?? POST_SIGNIN_REDIRECT_URI_DEFAULT;

      AuthorizationCodeRequestUrl authorizationRequestUrl = _flow.CreateAuthorizationCodeRequest(OAuthRedirectUri);
      authorizationRequestUrl.Scope = scope ?? authorizationRequestUrl.Scope;

      return Redirect(authorizationRequestUrl.Build().AbsoluteUri);
    }

    /// <summary>
    /// Handles the callback from the Google OAuth 2.0 flow.
    /// </summary>
    [HttpGet(nameof(GoogleOAuthCallback))]
    public async Task<IActionResult> GoogleOAuthCallback([FromQuery] string? code, [FromQuery] string? error) {
      if (!string.IsNullOrEmpty(error)) {
        return BadRequest(error);
      }

      ClaimsIdentity identity = GenerateNewLocalIdentity(out string nameIdentifier);
      User.AddIdentity(identity); // required to be authorized to create an account

      code ??= string.Empty;
      UserCredential credential;

      try {
        credential = await GenerateUserCredentialFromAuthorizationCode(code, nameIdentifier);
      } catch (TokenResponseException ex) {
        int statusCode = (int) (ex.StatusCode ?? HttpStatusCode.InternalServerError);
        return StatusCode(statusCode, ex.Message);
      }

      ClaimsPrincipal principleToSignInAs = new ClaimsPrincipal(User.Identities.Where(e => e.IsAuthenticated));
      await HttpContext.SignInAsync(principleToSignInAs);
      return LocalRedirect(PostSignInRedirectUriCookie);
    }


    /// <summary>
    /// Generates Google user crendentials from a Google authorization code.
    /// </summary>
    private async Task<UserCredential> GenerateUserCredentialFromAuthorizationCode(string code, string userId) {
      TokenResponse token = await _flow.ExchangeCodeForTokenAsync(userId, code, OAuthRedirectUri, CancellationToken.None);
      return new UserCredential(_flow, userId, token);
    }

    /// <summary>
    /// Generates a new identity with unique name identifier.
    /// </summary>
    private ClaimsIdentity GenerateNewLocalIdentity(out string nameIdentifier) {
      nameIdentifier = Guid.NewGuid().ToString();
      ClaimsIdentity identity = new ClaimsIdentity(AuthenticationTypes.Knowledge);
      identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, nameIdentifier));
      return identity;
    }

    /// <summary>
    /// An action result that on execution will sign out the user.
    /// </summary>
    [HttpGet("SignOut")]
    public SignOutResult SignOutEndpoint() {
      return SignOut();
    }
  }
}

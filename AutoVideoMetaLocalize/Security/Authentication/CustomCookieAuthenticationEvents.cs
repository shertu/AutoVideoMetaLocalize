using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Security.Authentication {
	// https://github.com/aspnet/Security/blob/master/src/Microsoft.AspNetCore.Authentication.Cookies/Events/CookieAuthenticationEvents.cs
	public class CustomCookieAuthenticationEvents : CookieAuthenticationEvents {
		public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.StatusCode = 401;
			return Task.CompletedTask;
		}

		public override Task RedirectToAccessDenied(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.StatusCode = 403;
			return Task.CompletedTask;
		}

		public override Task RedirectToLogout(RedirectContext<CookieAuthenticationOptions> context) {
			return Task.CompletedTask;
		}

		public override Task RedirectToReturnUrl(RedirectContext<CookieAuthenticationOptions> context) {
			return Task.CompletedTask;
		}
	}
}

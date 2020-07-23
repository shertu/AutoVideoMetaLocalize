using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using AutoVideoMetaLocalize.Security.Authentication;
using AutoVideoMetaLocalize.Utilities;
using ChanceNET;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace AutoVideoMetaLocalize {
	public class Startup {
		private const string SPA_ENTRY_FILENAME = "index.html";
		public static readonly Version APIVERSION = new Version(1, 0);
		public static readonly string APPNAME = Assembly.GetExecutingAssembly().GetName().Name;

		private readonly IConfiguration _configuration;

		public Startup(IConfiguration configuration) {
			_configuration = configuration;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services) {
			#region Google OAuth 2.0
			GoogleAuthorizationCodeFlow.Initializer authInitializer = new GoogleAuthorizationCodeFlow.Initializer {
				ClientSecrets = new ClientSecrets {
					ClientId = _configuration["Authentication:Google:ClientId"],
					ClientSecret = _configuration["Authentication:Google:ClientSecret"]
				},
				DataStore = GoogleDataStores.GOOGLE_AUTH_TOKEN_STORE,
				IncludeGrantedScopes = true,
				Scopes = new string[] {
					@"https://www.googleapis.com/auth/userinfo.profile",
				},
			};

			_ = services.AddScoped(elem => authInitializer);
			_ = services.AddScoped<GoogleCredentialManager>();
			#endregion

			#region chance
			// This is an implementation of the corresponding .js library
			Chance chance = new ConcurrentChance();
			_ = services.AddSingleton(chance);
			#endregion

			#region routing
			_ = services.AddControllers();
			#endregion

			#region authentication
			_ = services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
				.AddCookie(options => {
					/* The normal login system cannot combine with an OAuth 2.0 system
					 * as the app cannot 300 the user to the google login page.
					 */
					options.Events = new CustomCookieAuthenticationEvents();
				});
			#endregion

			#region authorization
			_ = services.AddAuthorization();
			#endregion

			#region Swashbuckle
			string version = APIVERSION.ToString();

			_ = services.AddSwaggerGen(options => {
				options.SwaggerDoc(version, new OpenApiInfo {
					Title = APPNAME,
					Version = version
				});
			});
			#endregion

			#region HttpContext
			_ = services.AddHttpContextAccessor();
			#endregion

			#region YouTube
			_ = services.AddScoped<YouTubeServiceAccessor>();
			#endregion

			#region Google Cloud Translate
			_ = services.AddScoped<GoogleCloudTranslateServiceAccessor>();
			#endregion

			#region session
			_ = services.AddDistributedMemoryCache();
			_ = services.AddSession();
			#endregion
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
			// https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/ 

			#region developer exception
			_ = app.UseDeveloperExceptionPage();
			#endregion

			#region rewrite
			RewriteOptions rewriteOptions = new RewriteOptions()
				.AddRewrite("privacy-policy", SPA_ENTRY_FILENAME, true)
				.AddRewrite("service", SPA_ENTRY_FILENAME, true)
				;

			_ = app.UseRewriter(rewriteOptions);
			#endregion

			#region static content
			_ = app.UseDefaultFiles(); // adds the base route to index.html

			StaticFileOptions staticFileOptions = new StaticFileOptions {
				OnPrepareResponse = staticFileResponseContext => {
					staticFileResponseContext.Context.Response.Headers.Append("Cache-Control", $"public, max-age={TimeSpan.FromDays(7).Seconds}");
				}
			};

			_ = app.UseStaticFiles(staticFileOptions);
			#endregion

			#region routing
			_ = app.UseRouting();
			#endregion

			#region cookie policy
			_ = app.UseCookiePolicy(new CookiePolicyOptions {
				MinimumSameSitePolicy = SameSiteMode.Strict,
			});
			#endregion

			#region authentication and authorization
			_ = app.UseAuthentication();
			_ = app.UseAuthorization();
			#endregion

			#region session
			_ = app.UseSession();
			#endregion

			#region endpoints
			_ = app.UseEndpoints(endpoints => {
				_ = endpoints.MapControllers();
			});
			#endregion

			#region Swashbuckle
			_ = app.UseSwagger(c => {
				c.PreSerializeFilters.Add((swagger, httpReq) => {
					swagger.Servers = new List<OpenApiServer> { new OpenApiServer { Url = $"{httpReq.Scheme}://{httpReq.Host.Value}" } };
				});
			});

			_ = app.UseSwaggerUI(c => {
				c.SwaggerEndpoint($"/swagger/{APIVERSION}/swagger.json", APPNAME);
			});
			#endregion
		}
	}
}

using System.Collections.Generic;
using System.Linq;
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
using AutoVideoMetaLocalize.Utilities;
using zukte.com.Security.Authentication;

namespace AutoVideoMetaLocalize {
  public class Startup {
    /// <summary>
    /// The name of the file to serve when the user accesses the web server.zs
    /// </summary>
    private const string SPA_ENTRY_FILENAME = "index.html";

    /// <summary>
    /// Represents a set of key/value application configuration properties.
    /// </summary>
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
        Scopes = new string[] {
          @"https://www.googleapis.com/auth/youtube",
        },
      };

      _ = services.AddScoped(elem => authInitializer);
      _ = services.AddScoped<GoogleCredentialManager>();
      #endregion

      #region routing
      _ = services.AddControllers();
      #endregion

      #region authentication
      _ = services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie(options => {
          options.Events = new CustomCookieAuthenticationEvents();
        });

      //_ = services.AddScoped<MineApplicationUserController>();
      //_ = services.AddScoped<ApplicationUsersController>();
      #endregion

      #region authorization
      _ = services.AddAuthorization(options => {
      });
      #endregion

      #region Swashbuckle
      _ = services.AddSwaggerGen(options => {
        options.SwaggerDoc(ApplicationValues.API_VERSION.ToString(), new OpenApiInfo {
          Title = ApplicationValues.NAME,
          Version = ApplicationValues.API_VERSION.ToString()
        });
      });
      #endregion

      #region YouTube and Google Cloud Translate
      _ = services.AddScoped<YouTubeServiceAccessor>();
      _ = services.AddScoped<GoogleCloudTranslateServiceAccessor>();
      _ = services.AddSingleton<IntegerStore>();
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
          staticFileResponseContext.Context.Response.Headers.Append("Cache-Control", $"public, max-age={System.TimeSpan.FromDays(7).Seconds}");
        }
      };

      _ = app.UseStaticFiles(staticFileOptions);
      #endregion

      #region routing
      _ = app.UseRouting();
      #endregion

      #region cookie policy
      _ = app.UseCookiePolicy(new CookiePolicyOptions {
        MinimumSameSitePolicy = SameSiteMode.Lax,
      });
      #endregion

      #region authentication and authorization
      _ = app.UseAuthentication();
      _ = app.UseAuthorization();
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
        c.SwaggerEndpoint($"/swagger/{ApplicationValues.API_VERSION}/swagger.json", ApplicationValues.NAME);
      });
      #endregion
    }
  }
}

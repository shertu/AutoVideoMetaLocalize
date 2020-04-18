using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using ChanceNET;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace AutoVideoMetaLocalize {
	public class Startup {
		private static readonly string CORS_POLICY = "_AllowSpecificOrigins";

		public static readonly Version APIVERSION = new System.Version(1, 0);
		public static readonly string APPNAME = Assembly.GetExecutingAssembly().GetName().Name;

		private readonly IConfiguration _configuration;

		public Startup(IConfiguration configuration) {
			_configuration = configuration;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services) {
			#region Google OAuth
			_ = services.AddScoped(elem => new ClientSecrets {
				ClientId = _configuration["Authentication:Google:ClientId"],
				ClientSecret = _configuration["Authentication:Google:ClientSecret"]
			});
			#endregion

			#region routing
			_ = services.AddControllers();
			#endregion

			#region chance
			// This is an implementation of the corresponding .js library
			Chance chance = new ConcurrentChance();
			_ = services.AddSingleton(chance);
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

			#region CORS
			_ = services.AddCors(options => {
				options.AddPolicy(CORS_POLICY,
				builder => {
					_ = builder.WithOrigins("http://www.AutoVideoMetaLocalize", "http://zukte.azurewebsites.net")
					.AllowAnyHeader()
					.AllowAnyMethod();
				});
			});
			#endregion
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
			#region routing
			_ = app.UseRouting();
			#endregion

			#region static content
			_ = app.UseStaticFiles(new StaticFileOptions {
				OnPrepareResponse = ctx => {
					ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={TimeSpan.FromDays(7).Seconds}");
				}
			});
			#endregion

			#region CORS
			_ = app.UseCors(CORS_POLICY);
			#endregion

			#region developer exception
			_ = app.UseDeveloperExceptionPage();
			#endregion

			#region endpoints
			_ = app.UseEndpoints(endpoints => {
				_ = endpoints.MapControllers();

				// TODO replace with actual endpoint mapping
				_ = endpoints.MapFallbackToFile("index.html");
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

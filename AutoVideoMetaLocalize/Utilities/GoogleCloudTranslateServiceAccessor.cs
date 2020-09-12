using AutoVideoMetaLocalize.Models;
using Google.Api.Gax.ResourceNames;
using Google.Cloud.Translate.V3;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCloudTranslateServiceAccessor {
		private readonly IConfiguration configuration;

		public GoogleCloudTranslateServiceAccessor(IConfiguration configuration) {
			this.configuration = configuration;
		}

		public async Task<TranslationServiceClient> InitializeServiceAsync() {
			GoogleServiceAccountCredentials credentials = configuration.GetSection("AutoVideoMetaLocalize-249eb3a3b3f9").Get<GoogleServiceAccountCredentials>();

			TranslationServiceClientBuilder builder = new TranslationServiceClientBuilder {
				JsonCredentials = credentials.ToString(),
			};

			return await builder.BuildAsync();
		}

		private const string PROJECT_ID = "autovideometalocalize";
		public static readonly string PARENT = new ProjectName(PROJECT_ID).ToString();
	}
}

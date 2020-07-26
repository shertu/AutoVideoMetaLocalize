using AutoVideoMetaLocalize.Models;
using Google.Api.Gax.ResourceNames;
using Google.Cloud.Translate.V3;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCloudTranslateServiceAccessor {
		private readonly GoogleCredentialManager gcm;
		private readonly IConfiguration configuration;

		public GoogleCloudTranslateServiceAccessor(GoogleCredentialManager gcm, IConfiguration configuration) {
			this.gcm = gcm;
			this.configuration = configuration;
		}

		public async Task<TranslationServiceClient> InitializeServiceAsync() {
			//UserCredential credential = await gcm.LoadUserCredentialsAsync();
			//string exedir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
			GoogleServiceAccountCredentials credentials = configuration.GetSection("AutoVideoMetaLocalize-249eb3a3b3f9").Get<GoogleServiceAccountCredentials>();
			//throw new System.Exception(credentials.ToString());

			TranslationServiceClientBuilder builder = new TranslationServiceClientBuilder {
				//CredentialsPath = Path.Combine(exedir, "AutoVideoMetaLocalize-249eb3a3b3f9.json"),
				//TokenAccessMethod = credential.GetAccessTokenForRequestAsync,
				JsonCredentials = credentials.ToString(),
			};

			return await builder.BuildAsync();
		}

		private const string PROJECT_ID = "autovideometalocalize";
		public static readonly string PARENT = new ProjectName(PROJECT_ID).ToString();
	}
}

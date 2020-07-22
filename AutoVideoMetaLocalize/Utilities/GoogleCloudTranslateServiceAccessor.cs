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
			string credentials = configuration["AutoVideoMetaLocalize-249eb3a3b3f9"];

			TranslationServiceClientBuilder builder = new TranslationServiceClientBuilder {
				//CredentialsPath = Path.Combine(exedir, "AutoVideoMetaLocalize-249eb3a3b3f9.json"),
				//TokenAccessMethod = credential.GetAccessTokenForRequestAsync,
				JsonCredentials = credentials,
			};

			return await builder.BuildAsync();
		}

		private const string PROJECT_ID = "autovideometalocalize";
		public static readonly string PARENT = new ProjectName(PROJECT_ID).ToString();
	}
}

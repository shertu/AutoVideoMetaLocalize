using Google.Api.Gax.ResourceNames;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Translate.V3;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCloudTranslateServiceAccessor {
		private readonly GoogleCredentialManager gcm;

		public GoogleCloudTranslateServiceAccessor(GoogleCredentialManager gcm) {
			this.gcm = gcm;
		}

		public async Task<TranslationServiceClient> InitializeServiceAsync() {
			//UserCredential credential = await gcm.LoadUserCredentialsAsync();
			string exedir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

			TranslationServiceClientBuilder builder = new TranslationServiceClientBuilder {
				CredentialsPath = Path.Combine(exedir, "AutoVideoMetaLocalize-249eb3a3b3f9.json"),
				//TokenAccessMethod = credential.GetAccessTokenForRequestAsync,
			};

			return await builder.BuildAsync();
		}

		private const string PROJECT_ID = "autovideometalocalize";
		public static readonly string PARENT = new ProjectName(PROJECT_ID).ToString();
	}
}

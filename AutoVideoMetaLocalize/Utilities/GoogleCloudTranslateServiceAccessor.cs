using Google.Api.Gax.ResourceNames;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Translate.V3;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCloudTranslateServiceAccessor {
		private readonly GoogleCredentialManager gcm;

		public GoogleCloudTranslateServiceAccessor(GoogleCredentialManager gcm) {
			this.gcm = gcm;
		}

		public async Task<TranslationServiceClient> InitializeServiceAsync() {
			UserCredential credential = await gcm.LoadUserCredentialsAsync();

			TranslationServiceClientBuilder builder = new TranslationServiceClientBuilder {
				TokenAccessMethod = credential.GetAccessTokenForRequestAsync,
			};

			return await builder.BuildAsync();
		}

		private const string PROJECT_ID = "autovideometalocalize";
		public static readonly string PARENT = new ProjectName(PROJECT_ID).ToString();
	}
}

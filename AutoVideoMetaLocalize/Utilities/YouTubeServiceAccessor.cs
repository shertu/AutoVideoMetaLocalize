using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class YouTubeServiceAccessor {
		private readonly GoogleCredentialManager gcm;

		public YouTubeServiceAccessor(GoogleCredentialManager gcm) {
			this.gcm = gcm;
		}

		public async Task<YouTubeService> InitializeServiceAsync(string userCredentialsKey) {
			UserCredential credential = await gcm.LoadUserCredentialsAsync(userCredentialsKey);

			return new YouTubeService(new BaseClientService.Initializer {
				HttpClientInitializer = credential,
				ApplicationName = ApplicationValues.NAME,
			});
		}
	}
}

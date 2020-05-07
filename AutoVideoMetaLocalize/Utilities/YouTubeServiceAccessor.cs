using Google.Apis.Auth.OAuth2;
using Google.Apis.YouTube.v3;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class YouTubeServiceAccessor {
		private readonly GoogleCredentialManager gcm;

		public YouTubeServiceAccessor(GoogleCredentialManager gcm) {
			this.gcm = gcm;
		}

		public async Task<YouTubeService> InitializeServiceAsync() {
			UserCredential credential = await gcm.LoadUserCredentialsAsync();

			return new YouTubeService(new YouTubeService.Initializer {
				HttpClientInitializer = credential,
				ApplicationName = "Auto Video Meta Localize",
			});
		}
	}
}

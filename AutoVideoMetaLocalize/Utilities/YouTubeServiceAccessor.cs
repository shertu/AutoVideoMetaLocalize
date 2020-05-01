using Google.Apis.Auth.OAuth2;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using System.Collections.Generic;
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

		#region extension methods
		public static async Task<IList<Channel>> ChannelsListAll(ChannelsResource.ListRequest request) {
			List<Channel> items = new List<Channel>();

			#region pagination response
			ChannelListResponse response;
			do {
				response = await request.ExecuteAsync();
				request.PageToken = response.NextPageToken;
				items.AddRange(response.Items);
			} while (response.NextPageToken != null);
			#endregion

			return items;
		}

		public static async Task<IList<Video>> VideosListAll(VideosResource.ListRequest request) {
			List<Video> items = new List<Video>();

			#region pagination response
			VideoListResponse response;
			do {
				response = await request.ExecuteAsync();
				request.PageToken = response.NextPageToken;
				items.AddRange(response.Items);
			} while (response.NextPageToken != null);
			#endregion

			return items;
		}
		#endregion
	}
}

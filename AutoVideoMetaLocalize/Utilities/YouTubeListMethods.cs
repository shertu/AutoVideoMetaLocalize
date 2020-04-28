using Google.Apis.Auth.OAuth2;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public static class YouTubeListMethods {
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

		public static async Task<IList<SearchResult>> SearchListAll(SearchResource.ListRequest request) {
			List<SearchResult> items = new List<SearchResult>();

			#region pagination response
			SearchListResponse response;
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
	}
}

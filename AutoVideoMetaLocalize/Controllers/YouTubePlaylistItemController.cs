using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class YouTubePlaylistItemController : ControllerBase {
		private readonly YouTubeServiceAccessor serviceAccessor;

		public YouTubePlaylistItemController(YouTubeServiceAccessor serviceAccessor) {
			this.serviceAccessor = serviceAccessor;
		}

		[HttpGet]
		public async Task<ActionResult<PlaylistItemListResponse>> GetVideosInPlaylist(
			[Required] string playlistId, string pageToken = null, long? maxResults = null
			) {
			if (string.IsNullOrEmpty(playlistId))
				throw new System.ArgumentException("message", nameof(playlistId));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			PlaylistItemsResource.ListRequest request = service.PlaylistItems.List("id,snippet");
			request.PlaylistId = playlistId;
			request.PageToken = pageToken;
			request.MaxResults = maxResults;
			PlaylistItemListResponse response = await request.ExecuteAsync();
			return new ActionResult<PlaylistItemListResponse>(response);
		}
	}
}
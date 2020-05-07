using AutoVideoMetaLocalize.Models;
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
		public async Task<ActionResult<PlaylistItemListResponse>> GetVideosInPlaylist([Required, FromQuery] string id, [FromQuery] PaginationRequestInformation pagination) {
			if (string.IsNullOrEmpty(id))
				throw new System.ArgumentException("message", nameof(id));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			PlaylistItemsResource.ListRequest request = service.PlaylistItems.List("id,snippet");
			request.PlaylistId = id;
			request.PageToken = pagination.PageToken;
			request.MaxResults = pagination.MaxResults;
			PlaylistItemListResponse response = await request.ExecuteAsync();
			return new ActionResult<PlaylistItemListResponse>(response);
		}
	}
}
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

		[HttpGet("ChannelTranslationConfigurationForm")]
		public async Task<ActionResult<PlaylistItemListResponse>> GetListForChannelTranslationConfigurationForm(
			[Required, FromQuery] string playlistId, [FromQuery] PaginationRequestInformation pagination) {
			if (string.IsNullOrEmpty(playlistId))
				throw new System.ArgumentException("message", nameof(playlistId));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			PlaylistItemsResource.ListRequest request = service.PlaylistItems.List("id,snippet");
			request.PlaylistId = playlistId;
			request.PageToken = pagination.PageToken;
			request.MaxResults = pagination.MaxResults;
			PlaylistItemListResponse response = await request.ExecuteAsync();
			return new ActionResult<PlaylistItemListResponse>(response);
		}
	}
}
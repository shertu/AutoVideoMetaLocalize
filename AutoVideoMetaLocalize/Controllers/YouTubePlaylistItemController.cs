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

		[HttpGet("List")]
		public async Task<ActionResult<PlaylistItemListResponse>> ListWherePlaylistId([Required, FromQuery] AppPlaylistItemListRequest request) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			PlaylistItemsResource.ListRequest requestActual = service.PlaylistItems.List(request.Part);
			requestActual.Id = request.Id;
			requestActual.MaxResults = request.MaxResults;
			requestActual.OnBehalfOfContentOwner = request.OnBehalfOfContentOwner;
			requestActual.PageToken = request.PageToken;
			requestActual.PlaylistId = request.PlaylistId;
			requestActual.VideoId = request.VideoId;

			PlaylistItemListResponse response = await requestActual.ExecuteAsync();
			return new ActionResult<PlaylistItemListResponse>(response);
		}
	}
}
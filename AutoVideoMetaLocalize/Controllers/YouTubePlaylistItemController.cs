using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google;
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
		public async Task<ActionResult<PlaylistItemListResponse>> List([Required, FromBody] AppPlaylistItemListRequest request) {
      string userId = User.GetLocalAuthorityNameIdentifier();
      YouTubeService service = await serviceAccessor.InitializeServiceAsync(userId);
			PlaylistItemsResource.ListRequest requestActual = request.ToActualRequest(service);

			try {
				PlaylistItemListResponse response = await requestActual.ExecuteAsync();
				return new ActionResult<PlaylistItemListResponse>(response);
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.ToString());
			}
		}
	}
}

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
	public class YouTubeChannelController : ControllerBase {
		private readonly YouTubeServiceAccessor serviceAccessor;

		public YouTubeChannelController(YouTubeServiceAccessor serviceAccessor) {
			this.serviceAccessor = serviceAccessor;
		}

		[HttpGet("List")]
		public async Task<ActionResult<ChannelListResponse>> List([Required, FromQuery] AppChannelListRequest request) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			ChannelsResource.ListRequest requestActual = request.ToActualRequest(service);

			try {
				ChannelListResponse response = await requestActual.ExecuteAsync();
				return new ActionResult<ChannelListResponse>(response);
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}
		}
	}
}
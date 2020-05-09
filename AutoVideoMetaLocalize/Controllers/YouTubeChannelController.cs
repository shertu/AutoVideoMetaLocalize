using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

		[HttpGet("id-snippet-contentdetails-where-mine")]
		public async Task<ActionResult<ChannelListResponse>> ForChannelSelect(
			[FromQuery] PaginationRequestInformation pagination) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			ChannelsResource.ListRequest request = service.Channels.List("id,snippet,contentDetails");
			request.Mine = true;
			request.PageToken = pagination.PageToken;
			request.MaxResults = pagination.MaxResults;
			ChannelListResponse response = await request.ExecuteAsync();
			return new ActionResult<ChannelListResponse>(response);
		}
	}
}
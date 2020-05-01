using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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

		[HttpGet("Mine")]
		public async Task<ActionResult<IEnumerable<Channel>>> GetMine() {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			ChannelsResource.ListRequest request = service.Channels.List("id,snippet,contentDetails");
			request.Mine = true;
			IList<Channel> response = await YouTubeServiceAccessor.ChannelsListAll(request);

			return new ActionResult<IEnumerable<Channel>>(response);
		}
	}
}
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
	public class SelectChannelController : ControllerBase {
		private readonly YouTubeServiceAccessor serviceAccessor;

		public SelectChannelController(YouTubeServiceAccessor serviceAccessor) {
			this.serviceAccessor = serviceAccessor;
		}

		[HttpGet("mine")]
		public async Task<ActionResult<IEnumerable<Channel>>> GetMineChannels() {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			// request
			ChannelsResource.ListRequest request = service.Channels.List("id,snippet");
			request.Mine = true;

			// reponse
			IList<Channel> channels = await YouTubeServiceAccessor.ChannelsListAll(request);

			return new ActionResult<IEnumerable<Channel>>(channels);
		}
	}
}
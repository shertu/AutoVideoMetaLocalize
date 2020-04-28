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
		private readonly GoogleCredentialManager gcm;

		public YouTubeChannelController(GoogleCredentialManager gcm) {
			this.gcm = gcm;
		}

		[HttpGet("mine")]
		public async Task<ActionResult<IEnumerable<Channel>>> GetMineChannels() {
			YouTubeService service = await gcm.InitializeYouTubeServiceAsync();

			ChannelsResource.ListRequest request = service.Channels.List("id,snippet");
			request.Mine = true;

			IList<Channel> channels = await YouTubeListMethods.ChannelsListAll(request);
			return new ActionResult<IEnumerable<Channel>>(channels);
		}
	}
}
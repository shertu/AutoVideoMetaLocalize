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
	public class YouTubeChannelController : ControllerBase {
		private readonly YouTubeServiceAccessor serviceAccessor;

		public YouTubeChannelController(YouTubeServiceAccessor serviceAccessor) {
			this.serviceAccessor = serviceAccessor;
		}

		[HttpGet("List")]
		public async Task<ActionResult<ChannelListResponse>> ForChannelSelect([Required, FromQuery] AppChannelListRequest request) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			ChannelsResource.ListRequest requestActual = service.Channels.List(request.Part);
			requestActual.CategoryId = request.CategoryId;
			requestActual.ForUsername = request.ForUsername;
			requestActual.Hl = request.Hl;
			requestActual.Id = request.Id;
			requestActual.ManagedByMe = request.ManagedByMe;
			requestActual.MaxResults = request.MaxResults;
			requestActual.Mine = request.Mine;
			requestActual.MySubscribers = request.MySubscribers;
			requestActual.OnBehalfOfContentOwner = request.OnBehalfOfContentOwner;
			requestActual.PageToken = request.PageToken;

			ChannelListResponse response = await requestActual.ExecuteAsync();
			return new ActionResult<ChannelListResponse>(response);
		}
	}
}
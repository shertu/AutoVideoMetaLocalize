using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoVideoMetaLocalize.Controllers {
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class AppProcessController : ControllerBase {
		private readonly GoogleCredentialManager gcm;

		public AppProcessController(GoogleCredentialManager gcm) {
			this.gcm = gcm;
		}

		[HttpPost("translate-channel")]
		public async Task<IActionResult> TranslateChannel([Required, FromRoute] Channel channel, [Required, FromForm] string[] languages) {
			YouTubeService service = await gcm.InitializeYouTubeServiceAsync();

			_ = await UserIsChannelOwner(channel);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			#region search
			SearchResource.ListRequest search_request = service.Search.List("id");
			search_request.Type = "video";
			search_request.MaxResults = 50;
			search_request.ChannelId = channel.Id;
			IList<SearchResult> search_results = await YouTubeListMethods.SearchListAll(search_request);
			#endregion

			#region videos
			VideosResource.ListRequest video_request = service.Videos.List("snippet");
			string combined_video_id = string.Join(',', search_results.Select(elem => elem.Id.VideoId));
			video_request.Id = combined_video_id;
			IList<Video> videos = await YouTubeListMethods.VideosListAll(video_request);
			#endregion

			return Ok(videos);
		}

		private async Task<bool> UserIsChannelOwner(Channel channel) {
			if (channel == null || channel.Id == null) {
				ModelState.AddModelError("", "The channel or its id were not found.");
			}

			YouTubeService service = await gcm.InitializeYouTubeServiceAsync();

			#region channel
			ChannelsResource.ListRequest request = service.Channels.List("id");
			request.Mine = true;
			IList<Channel> channels = await YouTubeListMethods.ChannelsListAll(request);
			#endregion

			return channels.Any(elem => elem.Id == channel.Id);
		}
	}
}
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
	public class TranslateChannelController : ControllerBase {
		private readonly YouTubeServiceAccessor serviceAccessor;

		public TranslateChannelController(YouTubeServiceAccessor serviceAccessor) {
			this.serviceAccessor = serviceAccessor;
		}

		[HttpPost("translate-channel")]
		public async Task<IActionResult> TranslateChannel([Required, FromRoute] string channelId, [Required, FromForm] string[] languages) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			if (!(await ValidateMineChannelId(channelId))) {
				return BadRequest("The specified channel id is invalid or the user is not the owner of the channel.");
			}

			#region LIST search
			SearchResource.ListRequest search_request = service.Search.List("id");
			search_request.Type = "video";
			search_request.MaxResults = 50;
			search_request.ChannelId = channelId;
			IList<SearchResult> searchList = await YouTubeServiceAccessor.SearchListAll(search_request);
			#endregion

			#region LIST video
			VideosResource.ListRequest video_request = service.Videos.List("snippet");
			string combined_video_id = string.Join(',', searchList.Select(elem => elem.Id.VideoId));
			video_request.Id = combined_video_id;
			IList<Video> videoList = await YouTubeServiceAccessor.VideosListAll(video_request);
			#endregion

			foreach (Video video in videoList) {
				string video_title = video.Snippet.Title;
				string video_description = video.Snippet.Description;

				foreach (string language in languages) {
					
				}

				#region UPDATE video
				VideosResource.UpdateRequest update_request = service.Videos.Update(video, "localizations");
				_ = await update_request.ExecuteAsync();
				#endregion
			}

			return Ok(videoList);
		}

		private async Task<bool> ValidateMineChannelId(string channelId) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			#region LIST channel
			ChannelsResource.ListRequest request = service.Channels.List("id");
			request.Mine = true;
			IList<Channel> channelsList = await YouTubeServiceAccessor.ChannelsListAll(request);
			#endregion

			return channelsList.Any(elem => elem.Id == channelId);
		}
	}
}
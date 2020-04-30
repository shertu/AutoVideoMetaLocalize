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
		private readonly GoogleCloudTranslateManager translate;
		private readonly YouTubeServiceAccessor serviceAccessor;

		public TranslateChannelController(GoogleCloudTranslateManager translate, YouTubeServiceAccessor serviceAccessor) {
			this.translate = translate;
			this.serviceAccessor = serviceAccessor;
		}

		[HttpPost("translate-channel")]
		public async Task<IActionResult> TranslateChannel([Required, FromRoute] string channelId, [Required, FromForm] string[] languages) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			#region LIST search
			SearchResource.ListRequest searchListRequest = service.Search.List("id");
			searchListRequest.Type = "video";
			searchListRequest.MaxResults = 50;
			searchListRequest.ChannelId = channelId;
			IList<SearchResult> searchList = await YouTubeServiceAccessor.SearchListAll(searchListRequest);
			#endregion

			#region LIST video
			VideosResource.ListRequest video_request = service.Videos.List("snippet");
			string combined_video_id = string.Join(',', searchList.Select(elem => elem.Id.VideoId));
			video_request.Id = combined_video_id;
			IList<Video> videoList = await YouTubeServiceAccessor.VideosListAll(video_request);
			#endregion

			for (int i = 0; i < videoList.Count; i++) {
				Video video = videoList[i];

				string video_title = video.Snippet.Title;
				string video_description = video.Snippet.Description;

				foreach (string language in languages) {
					TranslateTextRequest req = new TranslateTextRequest {
						Contents = { video_title, video_description },
						TargetLanguageCode = language,
						// SourceLanguageCode = automatically detect language
					};

					IList<Translation> res = await translate.TranslateTextAsync(req);
					foreach (Translation item in res) {
						string s = item.TranslatedText;
					}
				}

				#region UPDATE video
				VideosResource.UpdateRequest update_request = service.Videos.Update(video, "localizations");
				_ = await update_request.ExecuteAsync();
				#endregion
			}

			return Ok();
		}
	}
}
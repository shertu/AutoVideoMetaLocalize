using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class YouTubeVideoController : ControllerBase {
		private const string LOCALIZE_PART = "id,snippet,localizations";

		private readonly YouTubeServiceAccessor serviceAccessor;
		private readonly GoogleCloudTranslateManager translate;

		public YouTubeVideoController(YouTubeServiceAccessor serviceAccessor, GoogleCloudTranslateManager translate) {
			this.serviceAccessor = serviceAccessor;
			this.translate = translate;
		}

		[HttpGet("List")]
		public async Task<ActionResult<VideoListResponse>> List([Required, FromQuery] AppVideoListRequest request) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			VideosResource.ListRequest requestActual = request.ToActualRequest(service);

			try {
				VideoListResponse response = await requestActual.ExecuteAsync();
				return new ActionResult<VideoListResponse>(response);
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}
		}

		[HttpPost("Update")]
		public async Task<ActionResult<Video>> Update([Required, FromQuery] string part, [Required, FromBody] Video video) {
			if (part is null)
				throw new ArgumentNullException(nameof(part));
			if (video is null)
				throw new ArgumentNullException(nameof(video));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			VideosResource.UpdateRequest request = service.Videos.Update(video, part);

			try {
				Video response = await request.ExecuteAsync();
				return new ActionResult<Video>(response);
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}
		}

		[HttpPost("Localize")]
		public async Task<ActionResult<Video>> Localize(
			[Required, FromQuery] string id, [Required, FromBody] string[] languages) {
			if (id is null)
				throw new ArgumentNullException(nameof(id));
			if (languages is null)
				throw new ArgumentNullException(nameof(languages));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			VideosResource.ListRequest requestVideoList = service.Videos.List(LOCALIZE_PART);
			requestVideoList.MaxResults = 1;
			requestVideoList.Id = id;

			Video video;
			try {
				VideoListResponse responseVideoList = await requestVideoList.ExecuteAsync();
				video = responseVideoList.Items.Count > 0 ? responseVideoList.Items[0] : null;
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.ToString());
			}

			if (video is null)
				throw new ArgumentNullException(nameof(video));

			if (video.Snippet is null)
				throw new ArgumentNullException(nameof(video.Snippet));

			video.Snippet.DefaultLanguage ??= "en";
			video.Localizations ??= new Dictionary<string, VideoLocalization>();

			string vidTitle = video.Snippet.Title;
			string vidDescription = video.Snippet.Description;
			string vidLanguage = video.Snippet.DefaultLanguage;

			foreach (string language in languages) {
				TranslateTextRequest requestTranslateText = new TranslateTextRequest {
					TargetLanguageCode = language,
					SourceLanguageCode = vidLanguage,
				};

				VideoLocalization localization = new VideoLocalization {
					Title = await SimpleTranslation(requestTranslateText, vidTitle),
					Description = await SimpleTranslation(requestTranslateText, vidDescription),
				};

				video.Localizations[language] = localization;
			}

			return video;

			//return await Update(LOCALIZE_PART, video);
		}

		private async Task<string> SimpleTranslation(TranslateTextRequest request, string text) {
			if (request is null)
				throw new ArgumentNullException(nameof(request));
			if (string.IsNullOrEmpty(text))
				return text;

			request.Contents.Clear();
			request.Contents.Add(text);

			IList<Translation> response = await translate.TranslateTextAsync(request);
			return response[0].TranslatedText;
		}
	}
}
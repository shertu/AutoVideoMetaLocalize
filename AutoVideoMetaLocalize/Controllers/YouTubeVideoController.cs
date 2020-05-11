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
		public async Task<ActionResult<Video>> Update([Required, FromForm] Video video, [Required, FromForm] string part) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			VideosResource.UpdateRequest request = service.Videos.Update(video, part);

			try {
				Video response = await request.ExecuteAsync();
				return new ActionResult<Video>(response);
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}
		}

		private enum CONTENTS_INDEX {
			TITLE = 0,
			DESCRIPTION = 1,
		}

		[HttpPost("Localize")]
		public async Task<ActionResult<Video>> Localize(
			[Required, FromForm] string id, [Required, FromForm] string[] languages) {
			if (id is null)
				throw new ArgumentNullException(nameof(id));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			VideosResource.ListRequest requestVideoList = service.Videos.List("id,snippet,localizations");
			requestVideoList.MaxResults = 1;
			requestVideoList.Id = id;

			Video video;
			try {
				VideoListResponse response = await requestVideoList.ExecuteAsync();
				video = response.Items.Count > 0 ? response.Items[0] : null;
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}

			if (video is null)
				throw new ArgumentNullException(nameof(video));

			string videoLanguage = video.Snippet.DefaultLanguage;

			string[] contents = new string[2];
			contents[(int) CONTENTS_INDEX.TITLE] = video.Snippet.Title;
			contents[(int) CONTENTS_INDEX.DESCRIPTION] = video.Snippet.Description;

			foreach (string language in languages) {
				TranslateTextRequest request = new TranslateTextRequest {
					TargetLanguageCode = language,
					SourceLanguageCode = videoLanguage,
				};

				request.Contents.Add(contents);

				IList<Translation> response = await translate.TranslateTextAsync(request);

				Translation translationTitle = response[(int) CONTENTS_INDEX.TITLE];
				Translation translationDescription = response[(int) CONTENTS_INDEX.DESCRIPTION];

				VideoLocalization localization = new VideoLocalization {
					Title = translationTitle.TranslatedText,
					Description = translationDescription.TranslatedText,
				};

				video.Localizations[language] = localization;
			}

			return new ActionResult<Video>(video);
		}
	}
}
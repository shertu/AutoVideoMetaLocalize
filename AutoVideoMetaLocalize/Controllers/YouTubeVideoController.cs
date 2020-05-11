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
		public async Task<ActionResult<VideoListResponse>> ListWhereId([Required, FromQuery] AppVideoListRequest request) {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			VideosResource.ListRequest requestActual = service.Videos.List(request.Part);
			requestActual.VideoCategoryId = request.VideoCategoryId;
			requestActual.RegionCode = request.RegionCode;
			requestActual.PageToken = request.PageToken;
			requestActual.OnBehalfOfContentOwner = request.OnBehalfOfContentOwner;
			requestActual.MyRating = request.MyRating;
			requestActual.MaxWidth = request.MaxWidth;
			requestActual.MaxResults = request.MaxResults;
			requestActual.MaxHeight = request.MaxHeight;
			requestActual.Locale = request.Locale;
			requestActual.Id = request.Id;
			requestActual.Hl = request.Hl;
			requestActual.Chart = request.Chart;

			try {
				VideoListResponse response = await requestActual.ExecuteAsync();
				return new ActionResult<VideoListResponse>(response);
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}
		}

		[HttpPost("Update")]
		public async Task<ActionResult<Video>> UpdateVideo([Required, FromForm] Video video, [Required, FromForm] string part) {
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

		[HttpPost("AddLocalization")]
		public async Task<ActionResult<Video>> AddLocalizationToVideo(
			[Required, FromForm] Video video, [Required, FromForm] string[] languages) {
			if (video is null)
				throw new ArgumentNullException(nameof(video));

			if (video.Snippet == null)
				throw new ArgumentNullException(nameof(video.Snippet));

			if (video.Localizations == null)
				throw new ArgumentNullException(nameof(video.Localizations));

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
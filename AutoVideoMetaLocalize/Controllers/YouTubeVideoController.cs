using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
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

		[HttpGet("id-snippet-localizations-where-id")]
		public async Task<ActionResult<VideoListResponse>> ListWhereId(
			[Required, FromQuery] string id, [FromQuery] PaginationRequestInformation pagination) {
			if (string.IsNullOrEmpty(id))
				throw new ArgumentException("message", nameof(id));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();
			VideosResource.ListRequest request = service.Videos.List("id,snippet,localizations");
			request.Id = id;
			request.PageToken = pagination.PageToken;
			request.MaxResults = pagination.MaxResults;
			VideoListResponse response = await request.ExecuteAsync();
			return new ActionResult<VideoListResponse>(response);
		}

		[HttpPost("update-localizations")]
		public async Task<ActionResult<Video>> UpdateVideo([Required, FromForm] Video video) {
			if (video is null)
				throw new ArgumentNullException(nameof(video));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			Video temp = new Video {
				Id = video.Id,
				Localizations = video.Localizations,
			};

			VideosResource.UpdateRequest request = service.Videos.Update(temp, "id,localizations");
			Video response = await request.ExecuteAsync();
			return new ActionResult<Video>(response);
		}

		private enum CONTENTS_INDEX {
			TITLE = 0,
			DESCRIPTION = 1,
		}

		[HttpPost("add-localization")]
		public async Task<ActionResult<Video>> AddLocalizationToVideo(
			[Required, FromForm] Video video, [Required, FromForm] string targetLanguageCode) {
			if (video is null)
				throw new ArgumentNullException(nameof(video));

			if (video.Snippet is null)
				throw new ArgumentNullException(nameof(video.Snippet));

			if (video.Localizations is null)
				throw new ArgumentNullException(nameof(video.Localizations));

			string sourceLanguageCode = video.Snippet.DefaultLanguage;

			string[] contents = new string[2];
			contents[(int) CONTENTS_INDEX.TITLE] = video.Snippet.Title;
			contents[(int) CONTENTS_INDEX.DESCRIPTION] = video.Snippet.Description;

			TranslateTextRequest request = new TranslateTextRequest {
				TargetLanguageCode = targetLanguageCode,
				SourceLanguageCode = sourceLanguageCode,
			};

			request.Contents.Add(contents);

			IList<Translation> response = await translate.TranslateTextAsync(request);

			Translation translationTitle = response[(int) CONTENTS_INDEX.TITLE];
			Translation translationDescription = response[(int) CONTENTS_INDEX.DESCRIPTION];

			VideoLocalization localization = new VideoLocalization {
				Title = translationTitle.TranslatedText,
				Description = translationDescription.TranslatedText,
			};

			video.Localizations[targetLanguageCode] = localization;
			return new ActionResult<Video>(video);
		}
	}
}
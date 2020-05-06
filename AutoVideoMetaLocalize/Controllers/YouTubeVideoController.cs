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

		/// <summary>
		/// 
		/// </summary>
		/// <param name="id">
		/// 	The id parameter specifies a comma-separated list of the YouTube video ID(s)
		/// 	for the resource(s) that are being retrieved. In a video resource, the id property
		/// 	specifies the video's ID.
		/// </param>
		/// <param name="languages">
		///		The langauages parameter specifies an array of languages codes that 
		///		the titles and descriptions need to be translated into.
		/// </param>
		/// <returns></returns>
		[HttpPost("Translate")]
		public async Task<IActionResult> TranslateAsync([Required, FromForm] string id, [Required, FromForm] string[] languages) {
			if (string.IsNullOrEmpty(id))
				throw new ArgumentException("message", nameof(id));
			if (languages is null)
				throw new ArgumentNullException(nameof(languages));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			VideosResource.ListRequest request = service.Videos.List("snippet,localizations");
			request.Id = id;

			do {
				VideoListResponse response = await request.ExecuteAsync();

				foreach (Video video in response.Items) {
					await TranslateAsync(video, languages);
				}

				request.PageToken = response.NextPageToken;
			} while (request.PageToken != null);

			return Ok();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="video"></param>
		/// <param name="languages"></param>
		/// <returns></returns>
		private async Task TranslateAsync(Video video, string[] languages) {
			if (video is null)
				throw new ArgumentNullException(nameof(video));
			if (languages is null)
				throw new ArgumentNullException(nameof(languages));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			foreach (string language in languages) {
				await AddVideoLocalizationAsync(video, language);
			}

			VideosResource.UpdateRequest request = service.Videos.Update(video, "localizations");
			Video response = await request.ExecuteAsync();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="video"></param>
		/// <param name="language"></param>
		private async Task AddVideoLocalizationAsync(Video video, string language) {
			if (video is null)
				throw new ArgumentNullException(nameof(video));
			if (string.IsNullOrEmpty(language))
				throw new ArgumentException("message", nameof(language));

			string title = video.Snippet.Title;
			string description = video.Snippet.Description;

			TranslateTextRequest request = new TranslateTextRequest {
				TargetLanguageCode = language,
				//SourceLanguageCode
			};

			request.Contents.Add(title);
			request.Contents.Add(description);

			IList<Translation> response = await translate.TranslateTextAsync(request);

			Translation titleTranslation = response[0];
			Translation descriptionTranslation = response[1];

			VideoLocalization localization = new VideoLocalization {
				Title = titleTranslation.TranslatedText,
				Description = descriptionTranslation.TranslatedText,
			};

			video.Localizations[language] = localization;
		}
	}
}
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
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
		/// <param name="videoId">
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
		public async Task<IActionResult> TranslateVideosAsync([Required, FromForm] string videoId, [Required, FromForm] string[] languages) {
			if (string.IsNullOrEmpty(videoId))
				throw new ArgumentException("message", nameof(videoId));
			if (languages is null)
				throw new ArgumentNullException(nameof(languages));

			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			VideosResource.ListRequest request = service.Videos.List("snippet");
			request.Id = videoId;

			do {
				VideoListResponse response = await request.ExecuteAsync();

				foreach (Video video in response.Items) {
					await TranslateVideoAsync(video, languages);
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
		private async Task TranslateVideoAsync(Video video, string[] languages) {
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

			string videoTitle = video.Snippet.Title;
			string videoDescription = video.Snippet.Description;

			TranslateTextRequest request = new TranslateTextRequest {
				Contents = { videoTitle, videoDescription },
				TargetLanguageCode = language,
				//SourceLanguageCode
			};

			IList<Translation> response = await translate.TranslateTextAsync(request);

			video.Localizations[language] = new VideoLocalization {
				Title = videoTitle,
				Description = videoDescription,
			};
		}
	}
}
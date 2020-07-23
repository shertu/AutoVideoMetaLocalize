using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class YouTubeVideoController : ControllerBase {
		private const string SESSION_KEY_LOCALIZE_COUNT = "LOCALIZE_COUNT";
		private const string VIDEO_LOCALIZE_PART = "id,snippet,localizations";
		private const string SHEET_MUSIC_BOSS_TERM = "piano tutorial";

		private readonly YouTubeServiceAccessor youtubeServiceAccessor;
		private readonly GoogleCloudTranslateServiceAccessor translateServiceAccessor;

		public int LocalizationCount {
			get {
				int? value = HttpContext.Session.GetInt32(SESSION_KEY_LOCALIZE_COUNT);
				return value.GetValueOrDefault();
			}

			set => HttpContext.Session.SetInt32(SESSION_KEY_LOCALIZE_COUNT, value);
		}

		public YouTubeVideoController(YouTubeServiceAccessor youtubeServiceAccessor, GoogleCloudTranslateServiceAccessor translateServiceAccessor) {
			this.youtubeServiceAccessor = youtubeServiceAccessor;
			this.translateServiceAccessor = translateServiceAccessor;
		}

		//[HttpGet("List")]
		//public async Task<ActionResult<VideoListResponse>> List([Required, FromQuery] AppVideoListRequest request) {
		//	YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync();
		//	VideosResource.ListRequest requestActual = request.ToActualRequest(service);

		//	try {
		//		VideoListResponse response = await requestActual.ExecuteAsync();
		//		return new ActionResult<VideoListResponse>(response);
		//	} catch (GoogleApiException ex) {
		//		return StatusCode((int) ex.HttpStatusCode, ex.Message);
		//	}
		//}

		//[HttpPut("Update")]
		//public async Task<ActionResult<Video>> Update([Required, FromQuery] string part, [Required, FromBody] Video video) {
		//	if (part is null)
		//		throw new ArgumentNullException(nameof(part));
		//	if (video is null)
		//		throw new ArgumentNullException(nameof(video));

		//	YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync();
		//	VideosResource.UpdateRequest request = service.Videos.Update(video, part);

		//	try {
		//		Video response = await request.ExecuteAsync();
		//		return new ActionResult<Video>(response);
		//	} catch (GoogleApiException ex) {
		//		return StatusCode((int) ex.HttpStatusCode, ex.Message);
		//	}
		//}

		[HttpPut("Localize")]
		// should be a list of videos in response
		public async Task<ActionResult<IEnumerable<Video>>> LocalizeVideo([Required, FromBody] AppVideoLocalizeRequest body) {
			LocalizationCount = 0;
			string[] videos = body.Videos;
			Task<Video>[] tasks = new Task<Video>[videos.Length];
			YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync();

			VideosResource.ListRequest request = service.Videos.List(VIDEO_LOCALIZE_PART);
			request.Id = string.Join(',', videos);

			int i = 0;
			do {
				VideoListResponse response = await request.ExecuteAsync();
				IList<Video> items = response.Items;

				foreach (Video item in items) {
					tasks[i] = LocalizeVideoTask(item, body);
				}

				request.PageToken = response.NextPageToken;
			} while (request.PageToken != null);

			return await Task.WhenAll(tasks);
		}

		[HttpGet("LocalizeCount")]
		public ActionResult<int> LocalizeVideos() {
			return LocalizationCount;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="video"></param>
		/// <param name="body"></param>
		/// <returns></returns>
		private async Task<Video> LocalizeVideoTask(Video video, AppVideoLocalizeRequest body) {
			video = await AddLocalizationToVideo(video, body);
			video = await UpdateVideo(video, VIDEO_LOCALIZE_PART);
			return video;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="video"></param>
		/// <param name="body"></param>
		/// <returns></returns>
		private async Task<Video> AddLocalizationToVideo(Video video, AppVideoLocalizeRequest body) {
			TranslationServiceClient service = await translateServiceAccessor.InitializeServiceAsync();
			string[] languages = body.Languages;

			video.Snippet.DefaultLanguage ??= "en"; // TODO replace with language detection
			video.Localizations ??= new Dictionary<string, VideoLocalization>();

			Task[] tasks = new Task[languages.Length];

			for (int i = 0; i < languages.Length; i++) {
				string language = languages[i];
				tasks[i] = AddLocalizationToVideoTask(service, video, language, body);
				LocalizationCount++;
			}

			await Task.WhenAll(tasks);
			return video;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="video"></param>
		/// <param name="part"></param>
		/// <returns></returns>
		private async Task<Video> UpdateVideo(Video video, string part) {
			YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync();
			VideosResource.UpdateRequest request = service.Videos.Update(video, part);
			return await request.ExecuteAsync();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="service"></param>
		/// <param name="video"></param>
		/// <param name="language"></param>
		/// <param name="body"></param>
		/// <returns></returns>
		private async Task AddLocalizationToVideoTask(TranslationServiceClient service, Video video, string language, AppVideoLocalizeRequest body) {
			string vidTitle = video.Snippet.Title;
			string vidDescription = video.Snippet.Description;
			string vidLanguage = video.Snippet.DefaultLanguage;

			string targetLanguageCode = language;
			string sourceLanguageCode = vidLanguage;

			VideoLocalization localization = new VideoLocalization {
				Description = await service.SimpleTranslation(GoogleCloudTranslateServiceAccessor.PARENT, targetLanguageCode, sourceLanguageCode, vidDescription),
			};

			if (body.SheetMusicBoss) {
				string temp = await service.SimpleTranslation(GoogleCloudTranslateServiceAccessor.PARENT, targetLanguageCode, sourceLanguageCode, SHEET_MUSIC_BOSS_TERM);
				localization.Title = vidTitle.Replace(SHEET_MUSIC_BOSS_TERM, temp, true, CultureInfo.DefaultThreadCurrentCulture);
			} else {
				localization.Title = await service.SimpleTranslation(GoogleCloudTranslateServiceAccessor.PARENT, targetLanguageCode, sourceLanguageCode, vidTitle);
			}

			video.Localizations[language] = localization;
		}
	}
}
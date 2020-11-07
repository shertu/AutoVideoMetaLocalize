using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class YouTubeVideoController : ControllerBase {
    private const string VIDEO_LOCALIZE_PART = "id,snippet,localizations";
    private const string SHEET_MUSIC_BOSS_TERM = "piano tutorial";

    private readonly YouTubeServiceAccessor youtubeServiceAccessor;
    private readonly GoogleCloudTranslateServiceAccessor translateServiceAccessor;
    private readonly IntegerStore intStore;

    public YouTubeVideoController(
      YouTubeServiceAccessor youtubeServiceAccessor,
      GoogleCloudTranslateServiceAccessor translateServiceAccessor,
      IntegerStore intStore) {
      this.youtubeServiceAccessor = youtubeServiceAccessor;
      this.translateServiceAccessor = translateServiceAccessor;
      this.intStore = intStore;
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

    [HttpGet("LocalizationCount")]
    public ActionResult<int> GetProgress(string hash) {
      return intStore[hash];
    }

    [HttpPut("Localize")]
    public async Task<ActionResult<string>> LocalizeVideo([Required, FromBody] AppVideoLocalizeRequest body) {
      string localizationCountHash = Guid.NewGuid().ToString();
      intStore[localizationCountHash] = 0;

      string[] videos = body.MineChannelVideoUploadCollection;
      Task<Video>[] tasks = new Task<Video>[videos.Length];

      string userId = User.GetLocalAuthorityNameIdentifier();
      YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync(userId);

      VideosResource.ListRequest request = service.Videos.List(VIDEO_LOCALIZE_PART);
      request.Id = string.Join(',', videos);

      int i = 0;
      do {
        VideoListResponse response = await request.ExecuteAsync();
        IList<Video> items = response.Items;

        foreach (Video item in items) {
          tasks[i++] = LocalizeVideoTask(item, body, localizationCountHash); // All other tasks begin their life cycle in a hot state.
        }

        request.PageToken = response.NextPageToken;
      } while (request.PageToken != null);

      //Task.Run(async () => await Task.WhenAll(tasks));

      _ = Task.WhenAll(tasks); // wait for all videos to be localized and catch errors

      return new ActionResult<string>(localizationCountHash);
    }

    private async Task<Video> LocalizeVideoTask(Video video, AppVideoLocalizeRequest body, string localizationCountHash) {
      video = await AddLocalizationToVideo(video, body, localizationCountHash); // wait for all localizations to be added
      video = await UpdateVideo(video, VIDEO_LOCALIZE_PART); // update the video
      return video;
    }

    private async Task<Video> AddLocalizationToVideo(Video video, AppVideoLocalizeRequest body, string localizationCountHash) {
      TranslationServiceClient service = await translateServiceAccessor.InitializeServiceAsync();
      string[] languages = body.TranslationLanguageCollection;

      video.Snippet.DefaultLanguage ??= "en"; // TODO replace with language detection

      if (body.NullifyVideoLocalizations || video.Localizations == null) {
        video.Localizations = new Dictionary<string, VideoLocalization>();
      }


      Task[] tasks = new Task[languages.Length];

      for (int i = 0; i < languages.Length; i++) {
        string language = languages[i];
        tasks[i] = AddLocalizationToVideoTask(service, video, language, localizationCountHash);
      }

      await Task.WhenAll(tasks); // wait for all localizations to be added

      return video;
    }

    private async Task AddLocalizationToVideoTask(TranslationServiceClient service, Video video, string language, string localizationCountHash) {
      string vidTitle = video.Snippet.Title;
      string vidDescription = video.Snippet.Description;
      string vidLanguage = video.Snippet.DefaultLanguage;

      string targetLanguageCode = language;
      string sourceLanguageCode = vidLanguage;

      VideoLocalization localization = new VideoLocalization {
        Description = await service.SimpleTranslation(targetLanguageCode, sourceLanguageCode, vidDescription),
        Title = await service.SimpleTranslation(targetLanguageCode, sourceLanguageCode, vidTitle),
      };

      video.Localizations[language] = localization;
      _ = ++intStore[localizationCountHash];
    }

    private async Task<Video> UpdateVideo(Video video, string part) {
      string userId = User.GetLocalAuthorityNameIdentifier();
      YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync(userId);
      VideosResource.UpdateRequest request = service.Videos.Update(video, part);
      return await request.ExecuteAsync();
    }
  }
}

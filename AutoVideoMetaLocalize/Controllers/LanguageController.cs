using System.Collections.Generic;
using System.Threading.Tasks;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Linq;
using Google;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class LanguageController : ControllerBase {
		private readonly YouTubeServiceAccessor youtubeServiceAccessor;
		private readonly GoogleCloudTranslateServiceAccessor translateServiceAccessor;

		public LanguageController(YouTubeServiceAccessor youtubeServiceAccessor, GoogleCloudTranslateServiceAccessor translateServiceAccessor) {
			this.youtubeServiceAccessor = youtubeServiceAccessor;
			this.translateServiceAccessor = translateServiceAccessor;
		}

		[Authorize, HttpGet("YouTube-I18nLanguages")]
		public async Task<ActionResult<IEnumerable<I18nLanguageSnippet>>> GetYouTubeLanguages() {
      string userId = User.GetGoogleNameIdentifier();
      YouTubeService service = await youtubeServiceAccessor.InitializeServiceAsync(userId);
			I18nLanguagesResource.ListRequest req = service.I18nLanguages.List("snippet");

			try {
				I18nLanguageListResponse res = await req.ExecuteAsync();
				return new ActionResult<IEnumerable<I18nLanguageSnippet>>(res.Items.Select(elem => elem.Snippet));
			} catch (GoogleApiException ex) {
				return StatusCode((int) ex.HttpStatusCode, ex.Message);
			}
		}

		[HttpGet("GoogleTranslate-SupportedLanguages")]
		public async Task<ActionResult<IList<SupportedLanguage>>> GetGoogleTranslateLanguages() {
			TranslationServiceClient service = await translateServiceAccessor.InitializeServiceAsync();
			string[] displayLanguageCodeList = { "en" };

			#region Accept Header
			if (Request.Headers.TryGetValue("Accept-Language", out StringValues value)) {
				string[] accept_language_values = value.ToString().Split(',');
			}
			#endregion

			int i = 0; // iterate over display language code list
			IList<SupportedLanguage> response = null;
			while (response == null && i < displayLanguageCodeList.Length) {
				string displayLanguageCode = displayLanguageCodeList[i];

				try {
					SupportedLanguages temp = await service.GetSupportedLanguagesAsync(new GetSupportedLanguagesRequest {
						Parent = ApplicationValues.GOOGLE_PROJECT_NAME.ToString(),
						DisplayLanguageCode = displayLanguageCode,
					});

					response = temp.Languages;
				} catch (Grpc.Core.RpcException) {
					i++;
				}
			}

			return new ActionResult<IList<SupportedLanguage>>(response);
		}
	}
}

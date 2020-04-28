using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoVideoMetaLocalize.Models;
using AutoVideoMetaLocalize.Utilities;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class TranslateController : ControllerBase {
		private readonly GoogleCredentialManager gcm;
		private readonly GoogleCloudTranslateManager translate;

		public TranslateController(GoogleCredentialManager gcm, GoogleCloudTranslateManager translate) {
			this.gcm = gcm;
			this.translate = translate;
		}

		[HttpGet("youtube-languages")]
		[Authorize]
		public async Task<ActionResult<IEnumerable<AppSupportedLanguage>>> GetYouTubeLanguages() {
			YouTubeService service = await gcm.InitializeYouTubeServiceAsync();

			I18nLanguagesResource.ListRequest req = service.I18nLanguages.List("snippet");
			I18nLanguageListResponse res = await req.ExecuteAsync();
			IList<I18nLanguage> items = res.Items;

			IEnumerable<AppSupportedLanguage> appSupportedLanguages = items.Select(elem => new AppSupportedLanguage {
				Code = elem.Snippet.Hl,
				Name = elem.Snippet.Name,
			});

			return new ActionResult<IEnumerable<AppSupportedLanguage>>(appSupportedLanguages);
		}

		[HttpGet("google-translate-languages")]
		public async Task<ActionResult<IEnumerable<AppSupportedLanguage>>> GetGoogleTranslateLanguages() {
			string[] acceptedLanguages = { "en" };
			if (Request.Headers.TryGetValue("Accept-Language", out StringValues value)) {
				acceptedLanguages = value.ToArray();
			}

			if (acceptedLanguages.Length > 0) {
				IList<SupportedLanguage> supportedLanguages = await translate.GetSupportedLanguagesAsync(new GetSupportedLanguagesRequest {
					DisplayLanguageCode = acceptedLanguages[0].Split('-')[0], // IETF language tag
				});

				IEnumerable<AppSupportedLanguage> appSupportedLanguages = supportedLanguages.Select(elem => new AppSupportedLanguage {
					Code = elem.LanguageCode,
					Name = elem.DisplayName,
				});

				return new ActionResult<IEnumerable<AppSupportedLanguage>>(appSupportedLanguages);
			} else {
				return BadRequest("No acceptable languages found.");
			}
		}
	}
}
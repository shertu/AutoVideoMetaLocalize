using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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
	public class LanguageController : ControllerBase {
		private readonly GoogleCloudTranslateManager translate;
		private readonly YouTubeServiceAccessor serviceAccessor;

		public LanguageController(GoogleCloudTranslateManager translate, YouTubeServiceAccessor serviceAccessor) {
			this.translate = translate;
			this.serviceAccessor = serviceAccessor;
		}

		[HttpGet("YouTube-I18nLanguages")]
		[Authorize]
		public async Task<ActionResult<IEnumerable<AppSupportedLanguage>>> GetYouTubeLanguages() {
			YouTubeService service = await serviceAccessor.InitializeServiceAsync();

			I18nLanguagesResource.ListRequest req = service.I18nLanguages.List("snippet");
			I18nLanguageListResponse res = await req.ExecuteAsync();
			IList<I18nLanguage> items = res.Items;

			IEnumerable<AppSupportedLanguage> appSupportedLanguages = items.Select(elem => new AppSupportedLanguage {
				Code = elem.Snippet.Hl,
				Name = elem.Snippet.Name,
			});

			return new ActionResult<IEnumerable<AppSupportedLanguage>>(appSupportedLanguages);
		}

		[HttpGet("GoogleTranslate-SupportedLanguages")]
		public async Task<ActionResult<IEnumerable<AppSupportedLanguage>>> GetGoogleTranslateLanguages() {
			string[] displayLanguageCodeList = { "en" };

			#region Accept Header
			if (Request.Headers.TryGetValue("Accept-Language", out StringValues value)) {
				string[] accept_language_values = value.ToString().Split(',');
			}
			#endregion

			int i = 0;
			IList<SupportedLanguage> supportedLanguages = null;
			while (supportedLanguages == null) {
				string displayLanguageCode = (i < displayLanguageCodeList.Length) ? displayLanguageCodeList[i] : null;

				try {
					supportedLanguages = await translate.GetSupportedLanguagesAsync(new GetSupportedLanguagesRequest {
						DisplayLanguageCode = displayLanguageCode,
					});
				} catch (Grpc.Core.RpcException) {
					i++;
				}
			}

			IEnumerable<AppSupportedLanguage> appSupportedLanguages = supportedLanguages.Select(elem => new AppSupportedLanguage {
				Code = elem.LanguageCode,
				Name = elem.DisplayName,
			});

			return new ActionResult<IEnumerable<AppSupportedLanguage>>(appSupportedLanguages);
		}
	}
}
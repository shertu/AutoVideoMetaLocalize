using AutoVideoMetaLocalize.Utilities;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using System.Web;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class TranslationController : ControllerBase {
		private readonly GoogleCloudTranslateServiceAccessor translateServiceAccessor;

		public TranslationController(GoogleCloudTranslateServiceAccessor translateServiceAccessor) {
			this.translateServiceAccessor = translateServiceAccessor;
		}

		[HttpPost]
		[Authorize]
		public async Task<ActionResult<string>> GetSimpleTranslation(
			[Required, FromQuery] string targetLanguageCode,
			[Required, FromQuery] string sourceLanguageCode,
			[Required, FromBody] string text) {
			if (targetLanguageCode == sourceLanguageCode) {
				return text;
			}

			TranslateTextRequest request = new TranslateTextRequest {
				Parent = GoogleCloudTranslateServiceAccessor.PARENT,
				TargetLanguageCode = targetLanguageCode,
				SourceLanguageCode = sourceLanguageCode,
				Contents = { text },
			};

			TranslationServiceClient service = await translateServiceAccessor.InitializeServiceAsync();
			TranslateTextResponse response = await service.TranslateTextAsync(request);
			string translation = response.Translations[0].TranslatedText;

			// Translations are HTML encoded
			using StringWriter sw = new StringWriter();
			HttpUtility.HtmlDecode(translation, sw);
			return sw.ToString();
		}
	}
}
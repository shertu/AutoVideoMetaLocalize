using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoVideoMetaLocalize.Utilities;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class TranslationController : ControllerBase {
		private readonly GoogleCloudTranslateManager googleCloudTranslate;

		public TranslationController(GoogleCloudTranslateManager googleCloudTranslate) {
			this.googleCloudTranslate = googleCloudTranslate;
		}

		[HttpGet]
		public async Task<ActionResult<string>> GetSimpleTranslation(
			[Required, FromQuery] string targetLanguageCode, 
			[Required, FromQuery] string sourceLanguageCode, 
			[FromQuery] string text) {
			if (string.IsNullOrEmpty(text))
				return text;

			TranslateTextRequest request = new TranslateTextRequest {
				TargetLanguageCode = targetLanguageCode,
				SourceLanguageCode = sourceLanguageCode,
				Contents = { text },
			};

			IList<Translation> response = await googleCloudTranslate.TranslateTextAsync(request);
			return response[0].TranslatedText;
		}
	}
}
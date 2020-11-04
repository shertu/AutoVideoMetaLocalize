using AutoVideoMetaLocalize.Utilities;
using Google.Cloud.Translate.V3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
  [Route("api/[controller]")]
	[ApiController]
	public class TranslationController : ControllerBase {
		private readonly GoogleCloudTranslateServiceAccessor translateServiceAccessor;

		public TranslationController(GoogleCloudTranslateServiceAccessor translateServiceAccessor) {
			this.translateServiceAccessor = translateServiceAccessor;
		}

		[HttpPost]
		public async Task<ActionResult<string>> GetSimpleTranslation(
			[FromQuery] string targetLanguageCode,
			[FromQuery] string sourceLanguageCode,
			[FromBody] string text) {
			TranslationServiceClient service = await translateServiceAccessor.InitializeServiceAsync();
			return await service.SimpleTranslation(targetLanguageCode, sourceLanguageCode, text); ;
		}
	}
}

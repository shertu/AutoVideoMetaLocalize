using Google.Cloud.Translate.V3;
using System.IO;
using System.Threading.Tasks;
using System.Web;

namespace AutoVideoMetaLocalize.Utilities {
	public static class TranslationServiceClientExtension {
		public static async Task<string> SimpleTranslation(this TranslationServiceClient service, string targetLanguageCode, string sourceLanguageCode, string text) {
			if (targetLanguageCode == sourceLanguageCode) {
				return text;
			}

			if (string.IsNullOrWhiteSpace(text)) {
				return text;
			}

			TranslateTextRequest request = new TranslateTextRequest {
				Parent = ApplicationValues.GOOGLE_PROJECT_NAME.ToString(),
				TargetLanguageCode = targetLanguageCode,
				SourceLanguageCode = sourceLanguageCode,
				Contents = { text },
				MimeType = "text/plain",
			};

			TranslateTextResponse response = await service.TranslateTextAsync(request);
			string translation = response.Translations[0].TranslatedText;

			// Translations are HTML encoded
			using (StringWriter sw = new StringWriter()) {
				HttpUtility.HtmlDecode(translation, sw);
				return sw.ToString();
			}
		}
	}
}

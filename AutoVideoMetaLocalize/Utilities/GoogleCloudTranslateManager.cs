using Google.Api.Gax.ResourceNames;
using Google.Cloud.Translate.V3;
using Google.LongRunning;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
	public class GoogleCloudTranslateManager {
		private const string SERVICE_ACCOUNT_PROJECT_ID_JSON_KEY = "project_id";

		private readonly string pathToServiceAccount;
		private readonly TranslationServiceClient service;

		public GoogleCloudTranslateManager(string pathToServiceAccount) {
			this.pathToServiceAccount = pathToServiceAccount;

			service = new TranslationServiceClientBuilder {
				CredentialsPath = pathToServiceAccount
			}.Build();
		}

		private string PARENT {
			get {
				using StreamReader sr = File.OpenText(pathToServiceAccount);
				using JsonTextReader jtr = new JsonTextReader(sr);
				JObject obj = (JObject) JToken.ReadFrom(jtr);
				string project_id = obj.Value<string>(SERVICE_ACCOUNT_PROJECT_ID_JSON_KEY);
				ProjectName project_name = new ProjectName(project_id);
				return project_name.ToString();
			}
		}

		//BatchTranslateTextRequest

		public async Task<Operation<BatchTranslateResponse, BatchTranslateMetadata>> TranslateTextAsync(BatchTranslateTextRequest request) {
			request.Parent = PARENT;
			Operation<BatchTranslateResponse, BatchTranslateMetadata> response = await service.BatchTranslateTextAsync(request);
			return response;
		}

		public async Task<IList<Translation>> TranslateTextAsync(TranslateTextRequest request) {
			request.Parent = PARENT;
			TranslateTextResponse response = await service.TranslateTextAsync(request);
			return response.Translations;
		}

		public async Task<IList<SupportedLanguage>> GetSupportedLanguagesAsync(GetSupportedLanguagesRequest request) {
			request.Parent = PARENT;
			SupportedLanguages response = await service.GetSupportedLanguagesAsync(request);
			return response.Languages;
		}
	}
}

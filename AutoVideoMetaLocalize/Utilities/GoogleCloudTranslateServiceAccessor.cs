using AutoVideoMetaLocalize.Models;
using Google.Cloud.Translate.V3;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
  public class GoogleCloudTranslateServiceAccessor {
    private readonly IConfiguration configuration;

    public GoogleCloudTranslateServiceAccessor(IConfiguration configuration) {
      this.configuration = configuration;
    }

    public async Task<TranslationServiceClient> InitializeServiceAsync() {
      GoogleServiceAccountCredentials credentials = configuration
        .GetSection("AutoVideoMetaLocalize-249eb3a3b3f9")
        .Get<GoogleServiceAccountCredentials>();

      string jsonString = JsonSerializer.Serialize(credentials);

      TranslationServiceClientBuilder builder = new TranslationServiceClientBuilder {
        JsonCredentials = jsonString,
      };

      return await builder.BuildAsync();
    }
  }
}

using Google.Apis.Auth.OAuth2.Responses;
using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
  [Serializable]
  public class GoogleProfile {
    [JsonPropertyName("sub")]
    public string? Sub { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("given_name")]
    public string? GivenName { get; set; }

    [JsonPropertyName("family_name")]
    public string? FamilyName { get; set; }

    [JsonPropertyName("picture")]
    public string? Picture { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("email_verified")]
    public bool? EmailVerified { get; set; }

    [JsonPropertyName("locale")]
    public string? Locale { get; set; }

    public static async Task<GoogleProfile> FetchGoogleProfileAsync(TokenResponse token) {
      using HttpClient client = new HttpClient();
      return await FetchGoogleProfileAsync(token, client);
    }

    public static async Task<GoogleProfile> FetchGoogleProfileAsync(TokenResponse token, HttpClient client) {
      HttpResponseMessage response = await client.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token.AccessToken}");

      if (response.IsSuccessStatusCode) {
        using Stream stream = await response.Content.ReadAsStreamAsync();
        GoogleProfile value = await JsonSerializer.DeserializeAsync<GoogleProfile>(stream);
        return value;
      } else {
        throw new Exception(response.ReasonPhrase);
      }
    }
  }
}

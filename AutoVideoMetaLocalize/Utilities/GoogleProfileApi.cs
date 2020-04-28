//using Google.Apis.Auth.OAuth2.Responses;
//using Newtonsoft.Json;
//using System;
//using System.IO;
//using System.Net.Http;
//using System.Threading.Tasks;

//namespace AutoVideoMetaLocalize.Utilities {
//	public class GoogleProfileApi {
//		[Serializable]
//		public class GoogleProfile {
//			[JsonProperty("sub")]
//			public string Sub { get; set; }

//			[JsonProperty("name")]
//			public string Name { get; set; }

//			[JsonProperty("given_name")]
//			public string GivenName { get; set; }

//			[JsonProperty("family_name")]
//			public string FamilyName { get; set; }

//			[JsonProperty("picture")]
//			public string Picture { get; set; }

//			[JsonProperty("email")]
//			public string Email { get; set; }

//			[JsonProperty("email_verified")]
//			public bool? EmailVerified { get; set; }

//			[JsonProperty("locale")]
//			public string Locale { get; set; }
//		}

//		public static async Task<GoogleProfile> GetGoogleProfileAsync(TokenResponse token) {
//			using (HttpClient client = new HttpClient()) {
//				HttpResponseMessage response = await client.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token.AccessToken}");

//				if (response.IsSuccessStatusCode) {
//					using Stream stream = await response.Content.ReadAsStreamAsync();
//					using StreamReader sr = new StreamReader(stream);
//					using JsonTextReader jtr = new JsonTextReader(sr);
//					JsonSerializer serializer = JsonSerializer.CreateDefault();
//					return serializer.Deserialize<GoogleProfile>(jtr);
//				} else {
//					throw new Exception(response.ReasonPhrase);
//				}
//			}
//		}
//	}
//}

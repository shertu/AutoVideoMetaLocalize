using Google.Apis.YouTube.v3.Data;

namespace AutoVideoMetaLocalize.Models {
	public class AppAddLocalizationRequest {
		public Video Video { get; set; }
		public string[] Languages { get; set; }
	}
}

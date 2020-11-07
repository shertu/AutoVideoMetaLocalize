using System.ComponentModel.DataAnnotations;

namespace AutoVideoMetaLocalize.Models {
	public class AppVideoLocalizeRequest {
		[Required]
		public string[] MineChannelVideoUploadCollection { get; set; }

		[Required]
		public string[] TranslationLanguageCollection { get; set; }

    public bool NullifyVideoLocalizations { get; set; } = default;
  }
}

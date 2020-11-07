using System.ComponentModel.DataAnnotations;

namespace AutoVideoMetaLocalize.Models {
	public class AppVideoLocalizeRequest {
		[Required]
		public string[] Videos { get; set; }

		[Required]
		public string[] Languages { get; set; }

		public bool SheetMusicBoss { get; set; } = default;

    public bool ExcludeOtherLanguages { get; set; } = default;
  }
}

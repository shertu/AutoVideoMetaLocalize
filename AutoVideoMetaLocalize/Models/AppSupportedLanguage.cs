using System.ComponentModel.DataAnnotations;

namespace AutoVideoMetaLocalize.Models {
	public class AppSupportedLanguage {
		public string Name { get; set; }

		[Required]
		public string Code { get; set; }
	}
}

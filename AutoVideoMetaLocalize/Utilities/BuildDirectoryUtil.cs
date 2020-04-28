using System.IO;
using System.Reflection;

namespace AutoVideoMetaLocalize.Utilities {
	public static class BuildDirectoryUtil {
		public static string BuildDirectoryName {
			get {
				string path = Assembly.GetExecutingAssembly().Location;
				return Path.GetDirectoryName(path);
			}
		}
	}
}

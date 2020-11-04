using Google.Api.Gax.ResourceNames;
using System;

namespace AutoVideoMetaLocalize.Utilities {
  public static class ApplicationValues {
    /// <summary>
    /// The current name of the application.
    /// </summary>
    public static readonly string NAME = "Meta Localize";

    /// <summary>
    /// The current version of the application's API.
    /// </summary>
    public static readonly Version API_VERSION = new Version(1, 0);

    /// <summary>
    /// The name of the project on Google Cloud Services.
    /// </summary>
    public static readonly ProjectName GOOGLE_PROJECT_NAME = new ProjectName("autovideometalocalize");
  }
}

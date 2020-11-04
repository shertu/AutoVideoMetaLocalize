using System;
using System.Security.Claims;

namespace AutoVideoMetaLocalize.Utilities {
  public static class ClaimsExtensions {
    public const string GoogleClaimIssuer = "GOOGLE PTY LTD";

    public static Claim? FindLocalAuthorityNameIdentifier(this ClaimsPrincipal principal) {
      return principal.FindFirst(claim =>
      claim.Type == ClaimTypes.NameIdentifier &&
      claim.OriginalIssuer == ClaimsIdentity.DefaultIssuer);
    }

    public static Claim? FindGoogleNameIdentifier(this ClaimsPrincipal principal) {
      return principal.FindFirst(claim =>
      claim.Type == ClaimTypes.NameIdentifier &&
      claim.OriginalIssuer == ClaimsExtensions.GoogleClaimIssuer);
    }

    public static string GetLocalAuthorityNameIdentifier(this ClaimsPrincipal principal) {
      Claim? id = FindLocalAuthorityNameIdentifier(principal);
      return id == null ? throw new ArgumentNullException("Failed to find the user's Local Authority name identifier.") : id.Value;
    }

    public static string GetGoogleNameIdentifier(this ClaimsPrincipal principal) {
      Claim? id = FindGoogleNameIdentifier(principal);
      return id == null ? throw new ArgumentNullException("Failed to find the user's Google name identifier.") : id.Value;
    }
  }
}

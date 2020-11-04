using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Utilities {
  public class GoogleCredentialManager {
    private readonly GoogleAuthorizationCodeFlow _flow;

    public GoogleCredentialManager(GoogleAuthorizationCodeFlow.Initializer initializer) {
      _flow = new GoogleAuthorizationCodeFlow(initializer);
    }

    public async Task<UserCredential> LoadUserCredentialsAsync(string key) {
      TokenResponse token = await _flow.LoadTokenAsync(key, CancellationToken.None) ?? throw new FileLoadException("Failed to load the user's Google access token from the data store.");
      return new UserCredential(_flow, key, token);
    }
  }
}

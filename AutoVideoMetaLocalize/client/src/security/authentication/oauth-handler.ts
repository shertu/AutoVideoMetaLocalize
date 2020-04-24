import { GoogleAuthApi } from "../../../generated-sources/openapi";

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

export class OAuthHandler {
  public static async GoogleSignIn(uri?: string, scopes?: string[]): Promise<void> {
    this.SetSignRedirectUri(uri);

    let scope: string = null;
    if (scopes) {
      scope = scopes.join(' ');
    }

    const res: string = await GOOGLE_AUTH_API.apiGoogleAuthAuthorizationRequestUrlGet({
      scope: scope
    });

    window.location.assign(res);
  }

  public static GoogleSignOut(uri?: string): void {
    this.SetSignRedirectUri(uri);

    GOOGLE_AUTH_API.apiGoogleAuthGoogleSignOutGet();
  }

  private static SetSignRedirectUri(redirectUri?: string) {
    GOOGLE_AUTH_API.apiGoogleAuthSetSignRedirectUriPost({
      uri: redirectUri || window.location.pathname
    })
  }
}

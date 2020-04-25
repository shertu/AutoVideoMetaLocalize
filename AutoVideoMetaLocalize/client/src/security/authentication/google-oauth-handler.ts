import { GoogleAuthApi, TokenResponse } from "../../../generated-sources/openapi";

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

export class GoogleOAuthHandler {
  public static async signIn(params: {
    uri?: string,
    scopes?: string[]
  }): Promise<void> {
    this.setSignRedirectUri(params.uri);

    const scope: string = params.scopes.join(' ') || null;
    const res: string = await GOOGLE_AUTH_API.apiGoogleAuthGetAuthorizationRequestUrlGet({
      scope: scope
    });

    window.location.assign(res);
  }

  public static async signOut(params: {
    uri?: string
  }): Promise<void> {
    this.setSignRedirectUri(params.uri);
    GOOGLE_AUTH_API.apiGoogleAuthGoogleSignOutGet();
  }

  private static setSignRedirectUri(url: string = window.location.pathname) {
    GOOGLE_AUTH_API.apiGoogleAuthSetSignRedirectUriPost({
      uri: url
    })
  }
}

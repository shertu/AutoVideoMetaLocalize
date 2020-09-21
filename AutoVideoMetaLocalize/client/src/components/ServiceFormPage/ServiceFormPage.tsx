import { Alert, Progress, Space } from 'antd';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import COOKIE_NAMES, { writeJsonCookie } from '../../cookie-names';
import { useInterval } from '../../custom-react-hooks';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { Page } from '../Page/Page';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page which services the user's need to localize their YouTube videos.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [error, setError] =
    React.useState<boolean>(undefined);

  const [localizationOpCountHash, setLocalizationOpCountHash] =
    React.useState<string>(undefined);

  const [localizationOpCount, setLocalizationOpCount] =
    React.useState<number>(0);

  const [expectedTotalLocalizationOpCount, setExpectedTotalLocalizationOpCount] =
    React.useState<number>(0);

  console.log("ServiceFormPage", error, localizationOpCountHash, localizationOpCount, expectedTotalLocalizationOpCount)

  /** Turn off localization count update when expected op count is met. */
  React.useEffect(() => {
    if (localizationOpCount >= expectedTotalLocalizationOpCount) {
      setLocalizationOpCountHash(null);
    }
  }, [localizationOpCount, expectedTotalLocalizationOpCount]);

  /** */
  useInterval(1000, updateLocalizationOpCount)

  /** */
  function updateLocalizationOpCount(): void {
    if (localizationOpCountHash) {
      fetchLocalizationCount(localizationOpCountHash)
        .then((res: number) => setLocalizationOpCount(res));
    }
  }

  /**
   * Called when the service form is successfully filled out and submitted.
   *
   * @param {ServiceFormValues} values
   */
  function onFinish(values: ServiceFormValues): void {
    // Important for form values to have fallbacks as most are initially undefined.
    const request: AppVideoLocalizeRequest = {
      languages: values.languageSelect || [],
      videos: values.youtubeVideoSelectionTable || [],
      sheetMusicBoss: values.smbCheckbox || false,
    };

    const { languages, videos } = request;

    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, languages);

    setLocalizationOpCount(0);
    setExpectedTotalLocalizationOpCount(languages.length * videos.length);

    YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    })
      .then((res: string) => setLocalizationOpCountHash(res))
      .catch(() => setError(true));
  }

  /**
   * 
   * @param hash
   */
  async function fetchLocalizationCount(hash: string): Promise<number> {
    const localizationCount: number = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizationCountGet({
      hash: hash,
    }).catch((err: Response) => {
      console.log(err);
      return 0;
    });

    return localizationCount;
  }

  let progressValue: number = expectedTotalLocalizationOpCount > 0 ? localizationOpCount / expectedTotalLocalizationOpCount : 1;

  return (
    <AuthorizedContent>
      <Page title="Service">
        <ServiceForm
          onFinish={onFinish}
        />
      </Page>

      {expectedTotalLocalizationOpCount > 0 &&
        <Page title="Execution">
          <Space className="max-cell" direction="vertical" align="center">
            {error &&
              <Alert message="Error" description="An error occured which has halted execution." type="error" showIcon />
            }

            <Progress type="circle" percent={Math.floor(progressValue * 100)} status={error ? 'exception' : null} />
          </Space>
        </Page>
      }
    </AuthorizedContent>
  );
}

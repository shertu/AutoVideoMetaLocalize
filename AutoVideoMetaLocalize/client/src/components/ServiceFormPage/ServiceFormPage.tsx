import { Alert, Progress, Space } from 'antd';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import { CookiesNames } from '../../constants';
import { useInterval } from '../../custom-react-hooks';
import { writeJsonCookie } from '../../json-cookie';
import { AppPage } from '../AppPage/AppPage';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page which services the user's desire to localize their YouTube videos using Google Cloud Translate.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  /** The hash value of the localization op; used to determine execution progess. */
  const [localizationOpCountHash, setLocalizationOpCountHash] =
    React.useState<string>(undefined);

  /** The upper limit on the number of localization operations perfomred during execution. */
  const [localizationOpCountLimit, setLocalizationOpCountLimit] =
    React.useState<number>(0);

  /** The number of localization operations perfomred during execution. */
  const [localizationOpCount, setLocalizationOpCount] =
    React.useState<number>(0);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(undefined);

  const isExecuting: boolean = localizationOpCountHash != null;

  /** Turn off localization count updates when the localization op count limit is reached. */
  React.useEffect(() => {
    if (localizationOpCount >= localizationOpCountLimit) {
      setLocalizationOpCountHash(null);
    }
  }, [localizationOpCount, localizationOpCountLimit]);

  // use throttle library instead
  /** Call the localization op count update function. */
  useInterval(1000, onUpdateLocalizationOpCount);

  /** The function called when updating the localization op count. */
  function onUpdateLocalizationOpCount(): void {
    if (isExecuting) {
      fetchLocalizationOpCount(localizationOpCountHash)
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
      languages: values.languages || [],
      videos: values.videos || [],
      sheetMusicBoss: values.sheetMusicBoss || false,
    };

    const {languages, videos} = request;

    writeJsonCookie(CookiesNames.SERVICE_FORM_LANGUAGES, languages);

    YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    }).then((res: string) => {
      setLocalizationOpCount(0);
      setLocalizationOpCountLimit(languages.length * videos.length);
      setLocalizationOpCountHash(res);
    }).catch(() => setError(true));
  }

  /**
   * Fetches the ongoing localization op count for the specified hash.
   *
   * @param {string} hash
   */
  async function fetchLocalizationOpCount(hash: string): Promise<number> {
    const localizationCount: number = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizationCountGet({
      hash: hash,
    }).catch((err: Response) => {
      console.log(err);
      return 0;
    });

    return localizationCount;
  }

  /** The value of the progess component in the range [0, 1] */
  const progressValue: number = localizationOpCountLimit > 0 ? localizationOpCount / localizationOpCountLimit : 1;

  return (
    <AppPage title="Service">
      <ServiceForm
        onFinish={onFinish}
        submitDisabled={isExecuting}
      />

      {localizationOpCountLimit > 0 &&
        <AppPage title="Execution">
          <Space className="max-cell" direction="vertical" align="center">
            {error &&
              <Alert message="Error" description="An error occured which has halted execution." type="error" showIcon />
            }

            <Progress type="circle" percent={Math.floor(progressValue * 100)} status={error ? 'exception' : null} />
          </Space>
        </AppPage>
      }
    </AppPage>
  );
}

//<Result
//  status="403"
//  title="403"
//  subTitle="Sorry, you are not authorized to access this part of the website."
//  extra={
//    <Link to={ApplicationRouteInfo.ROUTE_HOME}>
//      <Button type="primary">Go Home</Button>
//    </Link>
//  }
///>

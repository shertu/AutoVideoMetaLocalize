import {Divider, PageHeader, Progress, Space} from 'antd';
import * as React from 'react';
import {AppVideoLocalizeRequest, YouTubeVideoApi} from '../../../generated-sources/openapi';
import {CookiesNames} from '../../constants';
import {useInterval} from '../../custom-react-hooks';
import {writeJsonCookie} from '../../json-cookie';
import {MaxCell} from '../MaxCell/MaxCell';
import {ServiceForm, ServiceFormValues, SERVICE_FORM_DEFAULT_VALUES} from './ServiceForm/ServiceForm';

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
  const [localizationOpCountMax, setLocalizationOpCountMax] =
    React.useState<number>(undefined);

  /** The number of localization operations perfomred during execution. */
  const [localizationOpCount, setLocalizationOpCount] =
    React.useState<number>(undefined);

  /** Has an error occured during a fetch op? */
  const [serviceExecutionError, setServiceExecutionError] =
    React.useState<boolean>(undefined);

  const hasHashValue: boolean = Boolean(localizationOpCountHash);

  // console.log('ServiceFormPage', localizationOpCountHash, localizationOpCountMax, localizationOpCount, serviceExecutionError);

  /** Turn off localization count updates when the localization op count limit is reached. */
  React.useEffect(() => {
    if (localizationOpCount >= localizationOpCountMax) {
      setLocalizationOpCountHash(null);
    }
  }, [localizationOpCount, localizationOpCountMax]);

  /** Call the localization op count update function.
   * TODO: Use a throttle library instead */
  useInterval(1000, onUpdateLocalizationOpCount);

  /** The function called when updating the localization op count. */
  function onUpdateLocalizationOpCount(): void {
    if (hasHashValue) {
      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizationCountGet({
        hash: localizationOpCountHash,
      }).then((res: number) => setLocalizationOpCount(res))
          .catch((res: Response) => console.log(res));
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
      languages: values.languages || SERVICE_FORM_DEFAULT_VALUES.languages,
      videos: values.videos || SERVICE_FORM_DEFAULT_VALUES.videos,
      sheetMusicBoss: values.sheetmusicboss || SERVICE_FORM_DEFAULT_VALUES.sheetmusicboss,
      excludeOtherLanguages: values.languageExclusion || SERVICE_FORM_DEFAULT_VALUES.languageExclusion,
    };

    executeAppVideoLocalizeRequest(request);
  }

  /**
   * Executes the service's localize request.
   *
   * @param {AppVideoLocalizeRequest} request
   */
  function executeAppVideoLocalizeRequest(request: AppVideoLocalizeRequest): void {
    writeJsonCookie<string[]>(CookiesNames.SERVICE_FORM_LANGUAGES, request.languages);

    setLocalizationOpCount(0);
    setLocalizationOpCountMax(request.languages.length * request.videos.length);

    YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    }).then((res: string) => {
      setLocalizationOpCountHash(res);
    }).catch(() => setServiceExecutionError(true));
  }

  /**
  * Calclulates the execution's progress on a scale of [0, 1].
  *
  * @return {number}
  */
  function calculateServiceExecutionProgressValue(): number {
    const a: number = localizationOpCount || 0;
    return localizationOpCountMax ? a / localizationOpCountMax : 1;
  }

  return (
    <MaxCell>
      <PageHeader title="service" />

      <ServiceForm
        onFinish={onFinish}
        submitDisabled={hasHashValue}
      />

      {localizationOpCountMax > 0 &&
        <MaxCell>
          <Divider>Execution</Divider>

          <Space className="max-cell" direction="vertical" align="center">
            <Progress type="circle" percent={Math.floor(calculateServiceExecutionProgressValue() * 100)} status={serviceExecutionError ? 'exception' : null} />
          </Space>
        </MaxCell>
      }
    </MaxCell>
  );
}

// <Result
//  status="403"
//  title="403"
//  subTitle="Sorry, you are not authorized to access this part of the website."
//  extra={
//    <Link to={ApplicationRouteInfo.ROUTE_HOME}>
//      <Button type="primary">Go Home</Button>
//    </Link>
//  }
// />

import { Carousel } from 'antd';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import COOKIE_NAMES, { writeJsonCookie } from '../../cookie-names';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { Page } from '../Page/Page';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [isExecuting, setIsExecuting] =
    React.useState<boolean>(undefined);

  const [error, setError] =
    React.useState<boolean>(undefined);

  const carouselRef = React.useRef<Carousel>();

  /** */
  React.useEffect(() => {
    const carouselTargetIndex: number = isExecuting ? 1 : 0;
    goToCarouselTargetIndex(carouselTargetIndex);
  }, [isExecuting]);

  /**
   * 
   * @param index
   */
  function goToCarouselTargetIndex(index: number) {
    const currentCarouselRef = carouselRef?.current;

    if (currentCarouselRef) {
      currentCarouselRef.goTo(index);
    }
  }

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: ServiceFormValues) {
    // Important for form values to have fallbacks as most are initially undefined.
    const request: AppVideoLocalizeRequest = {
      languages: values.languageSelect || [],
      videos: values.youtubeVideoSelectionTable || [],
      sheetMusicBoss: values.smbCheckbox || false,
    }

    onExecute(request);
  }

  async function onExecute(request: AppVideoLocalizeRequest) {
    setIsExecuting(true);

    console.log("WRITING LANGUAGE COOKIE", request.languages);
    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, request.languages);

    await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    }).catch(() => setError(true));

    setIsExecuting(false);
  }

  console.log("ServiceFormPage", isExecuting, error);

  return (
    <AuthorizedContent>
      <Carousel ref={carouselRef} dots={false}>
        <Page title="Service">
          <ServiceForm
            onFinish={onFinish}
          />
        </Page>
      </Carousel>
    </AuthorizedContent>
  );
}

//<ServiceExecutionStatusPage
//  request={request}
//  onFinish={() => setRequest(undefined)}
///>
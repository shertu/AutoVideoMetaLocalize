import { Carousel } from 'antd';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import COOKIE_NAMES, { writeJsonCookie } from '../../cookie-names';
import EventStates from '../../event-states';
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
  const [executionState, setExecutionState] =
    React.useState<EventStates>(EventStates.prospective);

  const [executionError, setExecutionError] =
    React.useState<boolean>(false);

  const [executionExpectedTotalOpCount, setExecutionExpectedTotalOpCount] =
    React.useState<number>(0);

  const carouselRef = React.useRef<Carousel>();

  const executionStatusPage: boolean = (executionState === EventStates.continuitive || executionState === EventStates.retropective);

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: ServiceFormValues) {
    // It is important for these values to have fallbacks.
    const request: AppVideoLocalizeRequest = {
      languages: values.languageSelect || [],
      videos: values.youtubeVideoSelectionTable || [],
      sheetMusicBoss: values.smbCheckbox || false,
    }

    console.log("Service form inputs: ", request);
    executeService(request);
  }

  /**
   * 
   * @param request
   */
  async function executeService(request: AppVideoLocalizeRequest) {
    const { languages, videos } = request;

    const expectedTotalOpCount = languages.length * videos.length;
    if (executionExpectedTotalOpCount === 0) {
      return;
    }

    // before execution state
    setExecutionState(EventStates.continuitive);
    setExecutionExpectedTotalOpCount(expectedTotalOpCount);

    // execution
    console.log("WRITING LANGUAGE COOKIE", languages);
    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, languages);

    const res = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    }).catch(() => setExecutionError(true));

    // after execution state
    setExecutionState(EventStates.retropective);
  }

  /** */
  React.useEffect(() => {
    const currentCarouselRef = carouselRef?.current;

    if (currentCarouselRef) {
      const carouselTargetIndex: number = executionStatusPage ? 1 : 0;
      currentCarouselRef.goTo(carouselTargetIndex);
    }
  }, [executionState]);

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
//  error={executionError}
//  executionState={executionState}
//  executionExpectedTotalOpCount={executionExpectedTotalOpCount}
//  onReturn={() => setExecutionState(EventStates.prospective)}
///>
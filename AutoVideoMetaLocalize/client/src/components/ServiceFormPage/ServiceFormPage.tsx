import { Carousel } from 'antd';
import * as cookie from 'cookie';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import COOKIE_NAMES from '../../cookie-names';
import EventStates from '../../event-states';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { Page } from '../Page/Page';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';
import { ServiceExecutionStatusPage } from './ServiceExecutionStatusPage/ServiceExecutionStatusPage';

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

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: ServiceFormValues) {
    const serviceFormInputs: AppVideoLocalizeRequest = {
      languages: values.languageSelect,
      videos: values.youtubeVideoSelectionTable,
      sheetMusicBoss: values.smbCheckbox,
    }

    console.log("Service form inputs: ", serviceFormInputs);
    executeService(serviceFormInputs);
  }

  /**
   * 
   * @param serviceFormInputs
   */
  async function executeService(serviceFormInputs: AppVideoLocalizeRequest) {
    if (serviceFormInputs == null) {
      return;
    }

    if (executionState == EventStates.continuitive) {
      return;
    }

    const languages = serviceFormInputs.languages || [];
    const videos = serviceFormInputs.videos || [];
    const expectedTotalOpCount = videos.length * languages.length;

    if (expectedTotalOpCount === 0) {
      return;
    }

    // before execution state
    setExecutionState(EventStates.continuitive);
    setExecutionExpectedTotalOpCount(expectedTotalOpCount);

    // execution
    document.cookie = cookie.serialize(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, languages.join(','));

    const res = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: serviceFormInputs,
    }).catch(() => setExecutionError(true));

    // after execution state
    setExecutionState(EventStates.retropective);
  }

  const executionStatusPage: boolean = (executionState === EventStates.continuitive || executionState === EventStates.retropective);

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

      <ServiceExecutionStatusPage
        error={executionError}
        executionState={executionState}
        executionExpectedTotalOpCount={executionExpectedTotalOpCount}
      />
    </AuthorizedContent>
  );
}


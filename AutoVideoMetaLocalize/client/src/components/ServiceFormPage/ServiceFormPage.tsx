import { Carousel } from 'antd';
import * as cookie from 'cookie';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import COOKIE_NAMES from '../../cookie-names';
import EventStates from '../../event-states';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { Page } from '../Page/Page';
import { ExecutionStateProvider } from './ExecutionStateContext/ExecutionStateContext';
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

  const [, setExecutionError] =
    React.useState<boolean>(false);

  const [, setExecutionProgressMax] =
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
  function executeService(serviceFormInputs: AppVideoLocalizeRequest) {
    if (serviceFormInputs == null) {
      return;
    }

    const languages = serviceFormInputs.languages || [];
    const videos = serviceFormInputs.videos || [];
    const expectedTotalOpCount = videos.length * languages.length;

    if ((executionState == EventStates.prospective || executionState == EventStates.retropective) && expectedTotalOpCount > 0) {
      setExecutionState(EventStates.continuitive);
      setExecutionError(false);
      setExecutionProgressMax(expectedTotalOpCount);
      
      document.cookie = cookie.serialize(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, languages.join(','));

      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
        appVideoLocalizeRequest: serviceFormInputs,
      }).then(() => {
        setExecutionState(EventStates.retropective);
      }).catch(() => {
        setExecutionState(EventStates.retropective);
        setExecutionError(true);
      });
    }
  }

  const showExecutionPage: boolean = executionState === EventStates.continuitive || executionState === EventStates.retropective;

  React.useEffect(() => {
    const currentCarouselRef = carouselRef?.current;

    if (currentCarouselRef) {
      const carouselTargetIndex: number = showExecutionPage ? 1 : 0;
      currentCarouselRef.goTo(carouselTargetIndex);
    }
  }, [executionState]);

  return (
    <AuthorizedContent>
      <ExecutionStateProvider value={executionState}>
        <Carousel ref={carouselRef} dots={false}>
          <Page title="Service">
            <ServiceForm
              onFinish={onFinish}
            />
          </Page>
        </Carousel>
      </ExecutionStateProvider>
    </AuthorizedContent>
  );
}

//<Page>
//  <ServiceFormExecutionPage
//    error={executionError}
//    executionProgressMax={executionProgressMax}
//    executionState={executionState}
//  />

//  <Row justify="end">
//    <Space>
//      <Button onClick={() => setExecutionState(EventStates.prospective)}>Return to Service Form</Button>
//    </Space>
//  </Row>
//</Page>
import { Carousel } from 'antd';
import * as React from 'react';
import { AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import * as cookie from 'cookie';
import { Page } from '../Page/Page';
import EventStates from '../../event-states';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';
import { ExecutionStateProvider } from './ExecutionStateContext/ExecutionStateContext';
import COOKIE_NAMES from '../../cookie-names';

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
      languages: values.language_select,
      videos: values.youtube_video_selection_table,
      sheetMusicBoss: values.smb_checkbox,
    }

    console.log("Service form inputs: ", serviceFormInputs);
    executeService(serviceFormInputs);
  }

  /**
   * 
   * @param serviceFormInputs
   */
  function executeService(serviceFormInputs: AppVideoLocalizeRequest) {
    if (executionState == EventStates.prospective || executionState == EventStates.retropective) {
      setExecutionState(EventStates.continuitive);
      setExecutionError(false);
      setExecutionProgressMax(serviceFormInputs.videos.length * serviceFormInputs.languages.length);
      
      document.cookie = cookie.serialize(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, serviceFormInputs.languages.join(','));

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
import { Alert, Button, Carousel, Progress, Row, Space } from 'antd';
import * as React from 'react';
import COOKIE_NAMES, { writeJsonCookie } from '../../cookie-names';
import EventStates from '../../event-states';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { Page } from '../Page/Page';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';
import { YouTubeVideoApi, AppVideoLocalizeRequest } from '../../../generated-sources/openapi';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [executionState, setExecutionState] =
    React.useState<EventStates>(EventStates.prospective);

  const [error, setError] =
    React.useState<boolean>(undefined);

  //const carouselRef = React.useRef<Carousel>();

  ///** */
  //React.useEffect(() => {
  //  const carouselTargetIndex: number = executionState ? 1 : 0;
  //  goToCarouselTargetIndex(carouselTargetIndex);
  //}, [executionState]);

  ///**
  // * 
  // * @param index
  // */
  //function goToCarouselTargetIndex(index: number) {
  //  const currentCarouselRef = carouselRef?.current;

  //  if (currentCarouselRef) {
  //    currentCarouselRef.goTo(index);
  //  }
  //}

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

  /**
   * 
   * @param request
   */
  async function onExecute(request: AppVideoLocalizeRequest) {
    setExecutionState(EventStates.continuitive);

    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, request.languages);

    await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    }).catch(() => setError(true));

    setExecutionState(EventStates.prospective);
  }

  ///** */
  //function onClickReturnToServiceForm() {
  //  goToCarouselTargetIndex(0);
  //  setExecutionState(EventStates.prospective);
  //}

  let progressValue: number;
  switch (executionState) {
    case EventStates.prospective:
      progressValue = 1;
      break;
    case EventStates.continuitive:
    case EventStates.prospective:
    default:
      progressValue = 0;
      break;
  }

  return (
    <AuthorizedContent>
      <Page title="Service">
        <ServiceForm
          onFinish={onFinish}
        />
      </Page>

      {(executionState === EventStates.continuitive || executionState === EventStates.retropective) &&
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

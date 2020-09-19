import {Alert, Progress, Space} from 'antd';
import * as React from 'react';
import {AppVideoLocalizeRequest, YouTubeVideoApi} from '../../../generated-sources/openapi';
import COOKIE_NAMES, {writeJsonCookie} from '../../cookie-names';
import EventStates from '../../event-states';
import {AuthorizedContent} from '../AuthorizedContent/AuthorizedContent';
import {Page} from '../Page/Page';
import {ServiceForm, ServiceFormValues} from './ServiceForm/ServiceForm';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page which services the user's need to localize their YouTube videos.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [executionState, setExecutionState] =
    React.useState<EventStates>(EventStates.prospective);

  const [error, setError] =
    React.useState<boolean>(undefined);

  /**
   * Called when the service form is successfully filled out and submitted.
   *
   * @param {ServiceFormValues} values
   */
  function onFinish(values: ServiceFormValues) {
    // Important for form values to have fallbacks as most are initially undefined.
    const request: AppVideoLocalizeRequest = {
      languages: values.languageSelect || [],
      videos: values.youtubeVideoSelectionTable || [],
      sheetMusicBoss: values.smbCheckbox || false,
    };

    onExecute(request);
  }

  /**
   * The event called when the service form is submitted.
   *
   * @param {AppVideoLocalizeRequest} request
   */
  async function onExecute(request: AppVideoLocalizeRequest) {
    setExecutionState(EventStates.continuitive);

    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, request.languages);

    await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: request,
    }).catch(() => setError(true));

    setExecutionState(EventStates.retropective);
  }

  let progressValue: number;
  switch (executionState) {
    case EventStates.prospective:
      progressValue = 0;
      break;
    case EventStates.continuitive:
      progressValue = 0;
      break;
    case EventStates.retropective:
      progressValue = 1;
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

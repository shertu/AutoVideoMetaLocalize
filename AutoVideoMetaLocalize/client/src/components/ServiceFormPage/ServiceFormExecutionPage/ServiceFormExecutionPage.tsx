import { Alert, Row, Progress } from 'antd';
import * as React from 'react';
import { Page } from '../../Page/Page';
import { useInterval } from '../../../hooks';
import EventStates from '../../../event-states';
import { YouTubeVideoApi } from '../../../../generated-sources/openapi';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceFormExecutionPage(props: {
  error?: boolean,
  executionProgressMax: number,
  executionState: EventStates,
}): JSX.Element {
  const [executionProgress, setExecutionProgress] =
    React.useState<number>(0);

  const { error, executionProgressMax, executionState } = props;
  const percent: number = executionProgressMax ? executionProgress / executionProgressMax : 1;

  useInterval(updateLocalizationCount, 800);

  function updateLocalizationCount() {
    if (executionState == EventStates.continuitive) {
      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizeCountGet()
        .then((res: number) => setExecutionProgress(res));
    } else {
      if (executionProgress < executionProgressMax) {
        setExecutionProgress(executionProgressMax);
      }
    }
  }

  return (
    <Page title="Execution">
      <Row align="top" justify="center">
        {error &&
          <Alert className="max-cell-sm" message="Error" description="Failed to load YouTube video information." type="error" showIcon />
        }

        <Row align="middle" justify="center">
          <Progress type="circle" percent={percent} status={error ? 'exception' : null} />
        </Row>
      </Row>
    </Page>
  );
}


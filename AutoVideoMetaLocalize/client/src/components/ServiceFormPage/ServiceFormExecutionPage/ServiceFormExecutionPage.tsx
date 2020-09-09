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
  const progressValue: number = executionProgressMax ? executionProgress / executionProgressMax : 1;

  useInterval(updateLocalizationCount, 800);

  console.log("executionProgress", executionProgress, "executionProgressMax", executionProgressMax);

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
      {error &&
        <Row justify="center">
          <Alert className="max-cell-sm" message="Error" description="An error occured which has halted execution." type="error" showIcon />
        </Row>
      }

      <Row justify="center">
        <Progress type="circle" percent={progressValue * 100} status={error ? 'exception' : null} />
      </Row>
    </Page>
  );
}


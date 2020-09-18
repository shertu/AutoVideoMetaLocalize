import { Alert, Button, Progress, Row, Space } from 'antd';
import * as React from 'react';
import { YouTubeVideoApi } from '../../../../generated-sources/openapi';
import { useInterval } from '../../../custom-react-hooks';
import EventStates from '../../../event-states';
import { Page } from '../../Page/Page';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceExecutionStatusPage(props: {
  error?: boolean,
  executionState?: EventStates,
  executionExpectedTotalOpCount?: number,
  onReturn?: () => void,
}): JSX.Element {
  const { error, executionExpectedTotalOpCount, executionState, onReturn } = props;

  const [executionProgress, setExecutionProgress] =
    React.useState<number>(0);

  //React.useEffect(() => {
  //  if (executionState === EventStates.continuitive) {
  //    setExecutionProgress(0);
  //  }
  //}, [executionState]);

  console.log("ops: ", executionProgress, "out of", executionExpectedTotalOpCount);
  const progressValue: number = executionExpectedTotalOpCount ? executionProgress / executionExpectedTotalOpCount : 1;

  useInterval(updateLocalizationCount, 800);


  function updateLocalizationCount() {
    if (executionState == EventStates.continuitive) {
      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizeCountGet()
        .then((res: number) => setExecutionProgress(res));
    }
    //else {
    //  if (executionProgress < executionExpectedTotalOpCount) {
    //    setExecutionProgress(executionExpectedTotalOpCount);
    //  }
    //}
  }

  return (
    <Page title="Execution">
      <Space className="max-cell" direction="vertical" align="center">
        {error &&
          <Alert message="Error" description="An error occured which has halted execution." type="error" showIcon />
        }

        <Progress type="circle" percent={progressValue * 100} status={error ? 'exception' : null} />

        <Row justify="end">
          <Space>
            <Button onClick={onReturn}>Return to Service Form</Button>
          </Space>
        </Row>
      </Space>
    </Page>
  );
}


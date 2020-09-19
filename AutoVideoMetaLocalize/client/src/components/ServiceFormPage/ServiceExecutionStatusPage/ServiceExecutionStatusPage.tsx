import { Alert, Button, Progress, Row, Space } from 'antd';
import * as React from 'react';
import { YouTubeVideoApi, AppVideoLocalizeRequest } from '../../../../generated-sources/openapi';
import { useInterval } from '../../../custom-react-hooks';
import EventStates from '../../../event-states';
import { Page } from '../../Page/Page';
import COOKIE_NAMES, { writeJsonCookie } from '../../../cookie-names';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceExecutionStatusPage(props: {
  request?: AppVideoLocalizeRequest,
  onFinish?: () => void,
}): JSX.Element {
  const { request, onFinish } = props;

  const [executionExpectedTotalOpCount, setExecutionExpectedTotalOpCount] =
    React.useState<number>(0);

  const [executionOpCount, setExecutionOpCount] =
    React.useState<number>(0);


  console.log("ServiceExecutionStatusPage.request: ", request);

  React.useEffect(() => {
    if (request) {
      setExecutionOpCount(0);
      setExecutionExpectedTotalOpCount(request.languages.length * request.videos.length);
    }
  }, [request]);

  useInterval(updateLocalizationCount, 800);

  function updateLocalizationCount() {
    if (request && executionOpCount < executionExpectedTotalOpCount) {
      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizeCountGet()
        .then((res: number) => setExecutionOpCount(res));
    }

    //if (executionState == EventStates.continuitive) {
    //  YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizeCountGet()
    //    .then((res: number) => setExecutionProgress(res));
    //}
    //else {
    //  if (executionProgress < executionExpectedTotalOpCount) {
    //    setExecutionProgress(executionExpectedTotalOpCount);
    //  }
    //}
  }


  console.log("ops: ", executionOpCount, "out of", executionExpectedTotalOpCount);
  const progressValue: number = executionExpectedTotalOpCount ? executionOpCount / executionExpectedTotalOpCount : 1;

  return (
    <Page title="Execution">
      <Space className="max-cell" direction="vertical" align="center">
        <Progress type="circle" percent={progressValue * 100} />

        <Row justify="end">
          <Space>
            <Button onClick={onFinish}>Return to Service Form</Button>
          </Space>
        </Row>
      </Space>
    </Page>
  );
}

//{
//  error &&
//  <Alert message="Error" description="An error occured which has halted execution." type="error" showIcon />
//}

//<Progress type="circle" percent={progressValue * 100} status={error ? 'exception' : null} />
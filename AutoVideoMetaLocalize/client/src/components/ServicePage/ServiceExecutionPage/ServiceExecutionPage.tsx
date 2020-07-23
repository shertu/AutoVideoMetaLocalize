import { Button, Card, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { Page } from '../../Page/Page';
import { AppVideoLocalizeRequest } from '../../../../generated-sources/openapi/models/AppVideoLocalizeRequest';
import { YouTubeVideoApi } from '../../../../generated-sources/openapi';
import { useInterval } from '../../../hooks';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The progress of the video translations and updates.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ServiceExecutionPage(props: {
  configuration: AppVideoLocalizeRequest,
  onComplete: () => void,
}): JSX.Element {
  const LANGUAGE_CODES: string[] = props.configuration.languages;
  const VIDEO_IDS: string[] = props.configuration.videos;

  const [complete, setComplete] =
    React.useState<boolean>(false);

  const [errorMessage, setErrorMessage] =
    React.useState<string>(null);

  const [localizationCount, setLocalizationCount] =
    React.useState<number>(0);

  const localizationCountMax: number = VIDEO_IDS.length * LANGUAGE_CODES.length;

  React.useEffect(() => {
    YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
      appVideoLocalizeRequest: props.configuration,
    }).then((res) => {
      console.log(res); // can be removed
      setComplete(true);
    }).catch((err: Response) => {
      err.text().then((text: string) => setErrorMessage(text));
      setComplete(true);
    });
  }, []);

  useInterval(updateLocalizationCount, 500);

  async function updateLocalizationCount() {
    if (complete) {
      setLocalizationCount(localizationCountMax);
    } else {
      const count: number = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizeCountGet();
      setLocalizationCount(count);
    }
  }

  const progressValue: number = (localizationCountMax) ? (localizationCount / localizationCountMax) : 1;
  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: Math.floor(progressValue * 100),
  };

  if (errorMessage) {
    progressProps.status = 'exception';
  }

  return (
    <Page title="Execution Progress">
      <Row align="middle" justify="center">
        <Progress {...progressProps} />
      </Row>
      <Row align="middle" justify="end">
        <Button
          type="primary"
          htmlType="submit"
          disabled={!complete}
          onClick={props.onComplete}>Finish</Button>
      </Row>

      {errorMessage && (
        <Page title="Execution Error">
          <Row align="middle" justify="center">
            <Card className="max-cell-md">
              <Typography.Paragraph>
                {errorMessage}
              </Typography.Paragraph>
            </Card>
          </Row>
        </Page>
      )}
    </Page>
  );
}

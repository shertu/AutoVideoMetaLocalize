import { Button, Card, Divider, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { ApiYouTubeVideoListGetRequest, Video, YouTubeVideoApi, VideoListResponse } from '../../../../../generated-sources/openapi';
import { ChannelTranslationConfiguration } from '../../../../ChannelTranslationConfiguration';
import { Page } from '../../Page';
import './style.less';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The content for the step where the user is selecting a channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ExecuteConfigurationPage(props: {
  configuration: ChannelTranslationConfiguration,
  onComplete: () => void,
}): JSX.Element {
  const languages: string[] = props.configuration.languageCodes;
  const ids: string[] = props.configuration.videoIds;

  const [errorMessage, setErrorMessage] =
    React.useState<string>(null);

  const [count, setCount] =
    React.useState<number>(0);

  const [countMax, setCountMax] =
    React.useState<number>(ids.length);

  React.useEffect(() => {
    for (var i = 0; i < ids.length; i++) {
      const id: string = ids[i];

      executeLocalizeVideo(id)
        .then((res) => {
          // log video
          console.log("VIDEO", res);

          // increment count
          setCount(count + 1);
        })
        .catch((err: Response) => {
          err.text().then((text: string) => setErrorMessage(text));
        });
    }
  }, []);

  async function executeLocalizeVideo(id: string): Promise<Video> {
    console.log("Alpha", id);

    const localizedVideo: Video = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePost({
      id: id,
      language: languages.join(','),
    });

    console.log("Beta", localizedVideo);

    const updatedVideo: Video = await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
      ...localizedVideo,
      part: 'id,localizations',
    });

    console.log("Gamma", updatedVideo);

    return updatedVideo;
  }

  const completeFrac: number = (countMax) ? (count / countMax) : 1;

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: completeFrac * 100,
  };

  if (errorMessage) {
    progressProps.status = 'exception';
  }

  return (
    <Page>
      <Divider>Execution Progress</Divider>

      <Row align="middle" justify="center">
        <Progress {...progressProps} />
      </Row>
      <Row align="middle" justify="end">
        <Button
          type="primary"
          htmlType="submit"
          disabled={completeFrac < 1 && !errorMessage}
          onClick={props.onComplete}>Finish</Button>
      </Row>

      {errorMessage && (
        <Page>
          <Divider>Execution Error</Divider>
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

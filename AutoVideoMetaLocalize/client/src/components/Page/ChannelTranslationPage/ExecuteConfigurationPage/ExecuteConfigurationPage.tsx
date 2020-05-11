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
    executeFetchVideos()
      .catch((err: Response) => {
        err.text().then((text: string) => setErrorMessage(text));
      });
  }, []);

  /**  */
  async function executeFetchVideos(): Promise<void> {
    const request: ApiYouTubeVideoListGetRequest = {
      id: ids.join(','),
      maxResults: 50,
      part: 'id,localizations,snippet'
    };

    do {
      let videoListResponse: VideoListResponse = await YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(request);
      // next page
      request.pageToken = videoListResponse.nextPageToken;

      // proccess each video individually
      const items: Video[] = videoListResponse.items;
      for (var i = 0; i < items.length; i++) {
        let item: Video = items[i];
        console.log("VIDEO BEFORE", item);
        item = await executeLocalizeVideo(item);
        console.log("VIDEO AFTER", item);

        // increment count
        setCount(count + 1);
      }
    } while (request.pageToken);
  }

  async function executeLocalizeVideo(video: Video): Promise<Video> {
    const localizedVideo: Video = await YOUTUBE_VIDEO_API.apiYouTubeVideoAddLocalizationPost({
      ...video,
      languages: languages,
    })

    const updatedVideo: Video = await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
      ...localizedVideo,
      part: 'id,localizations',
    })

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

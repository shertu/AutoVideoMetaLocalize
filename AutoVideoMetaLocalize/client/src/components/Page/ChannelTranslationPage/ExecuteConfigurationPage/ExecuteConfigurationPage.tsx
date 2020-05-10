import { Button, Card, Divider, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { ApiYouTubeVideoListGetRequest, Video, VideoListResponse, YouTubeVideoApi } from '../../../../../generated-sources/openapi';
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
  const languageCodes: string[] = props.configuration.languageCodes;
  const videoIds: string[] = props.configuration.videoIds;

  const [exception, setException] =
    React.useState<any>(null);

  const [count, setCount] =
    React.useState<number>(0);

  const [maximumCount, setMaximumCount] =
    React.useState<number>(0);

  React.useEffect(() => {
    execute()
      .catch(err => setException(err))
  }, []);

  async function execute(): Promise<void> {
    let countTemp: number = 0;
    let exceptionTemp: Response = null;

    const req: ApiYouTubeVideoListGetRequest = {
      id: videoIds.join(','),
      maxResults: 50,
      part: 'id,localizations,snippet'
    };

    do {
      const res: VideoListResponse = await YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(req);
      req.pageToken = res.nextPageToken;
      setMaximumCount(res.pageInfo.totalResults * languageCodes.length);

      const videos = res.items;
      for (var i = 0; i < videos.length && (exceptionTemp == null); i++) {
        const video: Video = videos[i];

        for (var j = 0; j < languageCodes.length && (exceptionTemp == null); j++) {
          const targetLanguageCode = languageCodes[j];

          await YOUTUBE_VIDEO_API.apiYouTubeVideoAddLocalizationPost({
            ...video,
            targetLanguageCode: targetLanguageCode,
          }).then((res) => {
            video.localizations = res.localizations;
          }).catch((err) => exceptionTemp = err);

          setCount(++countTemp);
        }

        delete video.snippet; // YouTube API requires additional parts to be removed.

        await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
          ...video,
          part: 'id,localizations',
        }).catch((err) => exceptionTemp = err);
      }

    } while (req.pageToken && (exceptionTemp == null));

    console.log(exceptionTemp);

    // set the exception
    setException(exceptionTemp);
  }

  const completeFrac: number = (maximumCount) ? (count / maximumCount) : 1;

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: completeFrac * 100,
  };

  if (exception) {
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
          disabled={completeFrac < 1 && !exception}
          onClick={props.onComplete}>Finish</Button>
      </Row>

      {exception && (
        <Page>
          <Divider>Execution Error</Divider>
          <Row align="middle" justify="center">
            <Card className="max-cell-md">
              <Typography.Paragraph>
                {exception.text().then()}
              </Typography.Paragraph>
            </Card>
          </Row>
        </Page>
      )}
    </Page>
  );
}

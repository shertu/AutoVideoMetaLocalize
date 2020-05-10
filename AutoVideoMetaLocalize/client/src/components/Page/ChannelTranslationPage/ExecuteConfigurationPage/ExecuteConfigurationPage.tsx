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
  const languages: string[] = props.configuration.languageCodes;
  const ids: string[] = props.configuration.videoIds;

  const [exceptionText, setExceptionText] =
    React.useState<string>(null);

  const [count, setCount] =
    React.useState<number>(0);

  const [maximumCount, setMaximumCount] =
    React.useState<number>(0);

  React.useEffect(() => {
    execute();
  }, []);

  function execute() {
    const req: ApiYouTubeVideoListGetRequest = {
      id: ids.join(','),
      maxResults: 50,
      part: 'id,localizations,snippet'
    };

    do {
      YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(req)
        .then((res) => {
          req.pageToken = res.nextPageToken;
          setMaximumCount(res.pageInfo.totalResults * languages.length);

          for (var i = 0; i < res.items.length && !exceptionText; i++) {
            executeVideo(res.items[i]);
          }
        })
        .catch((err: Response) => {
          err.text().then(text => setExceptionText(text));
        });
    } while (req.pageToken && !exceptionText);
  }

  function executeVideo(video: Video) {
    for (var j = 0; j < languages.length && !exceptionText; j++) {
      const languageCode: string = languages[j];

      YOUTUBE_VIDEO_API.apiYouTubeVideoAddLocalizationPost({
        ...video,
        targetLanguageCode: languageCode,
      })
        .then((res) => {
          video.localizations = { ...video.localizations, ...res.localizations };

          setCount(count + 1); // increment the progress
        })
        .catch((err: Response) => {
          err.text().then(text => setExceptionText(text));
        });
    }

    delete video.snippet; // YouTube API requires additional parts to be removed.

    YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
      ...video,
      part: 'id,localizations',
    })
      .catch((err: Response) => {
        err.text().then(text => setExceptionText(text));
      });
  }

  const completeFrac: number = (maximumCount) ? (count / maximumCount) : 1;

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: completeFrac * 100,
  };

  if (exceptionText) {
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
          disabled={completeFrac < 1 && !exceptionText}
          onClick={props.onComplete}>Finish</Button>
      </Row>

      {exceptionText && (
        <Page>
          <Divider>Execution Error</Divider>
          <Row align="middle" justify="center">
            <Card className="max-cell-md">
              <Typography.Paragraph>
                {exceptionText}
              </Typography.Paragraph>
            </Card>
          </Row>
        </Page>
      )}
    </Page>
  );
}

import { Button, Card, Divider, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { ApiYouTubeVideoListGetRequest, Video, YouTubeVideoApi } from '../../../../../generated-sources/openapi';
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

  const [error, setError] =
    React.useState<any>(null);

  const [errorMessage, setErrorMessage] =
    React.useState<string>(null);

  const [count, setCount] =
    React.useState<number>(0);

  const [maximumCount, setMaximumCount] =
    React.useState<number>(0);


  console.log("props", props);
  console.log("state", error, errorMessage, count, maximumCount);

  console.log("isError", isResponse(error));

  React.useEffect(() => {
    execute()
      .catch((err) => setError(err));
  }, []);

  React.useEffect(() => {
    if (error && isResponse(error)) {
      error.text().then((text: string) => setErrorMessage(text));
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  function isResponse(val: any): val is Response {
    return (val as Response).status !== undefined;
  }

  async function execute() {
    const req: ApiYouTubeVideoListGetRequest = {
      id: ids.join(','),
      maxResults: 50,
      part: 'id,localizations,snippet'
    };

    do {
      const res = await YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(req);

      req.pageToken = res.nextPageToken;
      console.log(res.pageInfo.totalResults * languages.length);
      setMaximumCount(res.pageInfo.totalResults * languages.length);
      const items = res.items;

      for (var i = 0; i < items.length; i++) {
        executeVideo(items[i]);
      }
    } while (req.pageToken);
  }

  async function executeVideo(video: Video): Promise<void> {
    for (var i = 0; i < languages.length; i++) {
      const languageCode: string = languages[i];

      const res = await YOUTUBE_VIDEO_API.apiYouTubeVideoAddLocalizationPost({
        ...video,
        targetLanguageCode: languageCode,
      });

      video.localizations = { ...video.localizations, ...res.localizations };
      setCount(count + 1); // increment the progress
    }

    //delete video.snippet; // YouTube API requires additional parts to be removed.

    await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
      ...video,
      part: 'id,localizations',
    });
  }

  async function addLocalization(video: Video, languageCode: string): Promise<Video> {
    const res: Video = await YOUTUBE_VIDEO_API.apiYouTubeVideoAddLocalizationPost({
      ...video,
      targetLanguageCode: languageCode,
    });

    return res;
  }

  const completeFrac: number = (maximumCount) ? (count / maximumCount) : 1;

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: completeFrac * 100,
  };

  if (error) {
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
          disabled={completeFrac < 1 && !error}
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

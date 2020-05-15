import { Button, Card, Divider, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { ApiYouTubeVideoListGetRequest, Video, VideoListResponse, VideoLocalization, YouTubeVideoApi } from '../../../../generated-sources/openapi';
import { ApiTranslationGetRequest, TranslationApi } from '../../../../generated-sources/openapi/apis/TranslationApi';
import { ChannelTranslationConfiguration } from '../../../ChannelTranslationConfiguration';
import { Page } from '../../Page/Page';
import './style.less';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();
const TRANSLATION_API: TranslationApi = new TranslationApi();

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

  const [errorMessage, setErrorMessage] =
    React.useState<string>(null);

  const [count, setCount] =
    React.useState<number>(0);

  const count_max: number = videoIds.length;

  React.useEffect(() => {
    let synchronousCount: number = 0;

    forEveryVideo((video) => {
      localizeAndThenUpdateVideo(video);
      synchronousCount++
    })
      .catch((err: Response) => {
        err.text().then((text: string) => setErrorMessage(text));
      });
  }, []);

  /**
   * 
   * @param callback
   */
  async function forEveryVideo(callback: (video: Video) => void) {
    const request: ApiYouTubeVideoListGetRequest = {
      part: 'id,snippet,localization',
      id: videoIds.join(','),
    };

    do {
      const response: VideoListResponse = await YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(request);
      const items: Video[] = response.items;

      items.forEach((_) => {
        callback(_);
      });

      request.pageToken = response.nextPageToken;
    } while (request.pageToken);
  }

  /**
   * 
   * @param video
   */
  async function localizeAndThenUpdateVideo(video: Video): Promise<Video> {
    video = await localizeVideo(video);

    video = await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
      video: video, 
      part: 'id,snippet,localizations',
    });

    return video;
  }

  /**
   * 
   * @param video
   */
  async function localizeVideo(video: Video): Promise<Video> {
    video.snippet.defaultLanguage = video.snippet.defaultLanguage || "en";
    video.localizations = video.localizations || {};

    const vidTitle: string = video.snippet.title;
    const vidDescription: string = video.snippet.description;
    const vidDefaultLanguage: string = video.snippet.defaultLanguage;

    for (var languageCode in languageCodes) {
      const request: ApiTranslationGetRequest = {
        targetLanguageCode: languageCode,
        sourceLanguageCode: vidDefaultLanguage,
      };

      const localization: VideoLocalization = {
        title: await TRANSLATION_API.apiTranslationGet({ ...request, text: vidTitle }),
        description: await TRANSLATION_API.apiTranslationGet({ ...request, text: vidDescription }),
      };

      video.localizations[languageCode] = localization;
    }

    return video;
  }

  const completeFrac: number = (count_max) ? (count / count_max) : 1;

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

import { Button, Card, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { ApiYouTubeVideoListGetRequest, Video, VideoListResponse, VideoLocalization, YouTubeVideoApi } from '../../../../generated-sources/openapi';
import { ApiTranslationGetRequest, TranslationApi } from '../../../../generated-sources/openapi/apis/TranslationApi';
import { ServiceFormInput } from '../ServiceFormInput';
import { Page } from '../../Page/Page';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();
const TRANSLATION_API: TranslationApi = new TranslationApi();

const VIDEO_PART = 'id,snippet,localizations';

/**
 * The progress of the video translations and updates.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ServiceExecutionPage(props: {
  configuration: ServiceFormInput,
  onComplete: () => void,
}): JSX.Element {
  const LANGUAGE_CODES: string[] = props.configuration.languages;
  const VIDEO_IDS: string[] = props.configuration.videos;
  const SHEET_MUSIC_BOSS: boolean = props.configuration.sheetmusicboss;

  const [errorMessage, setErrorMessage] =
    React.useState<string>(null);

  const [count, setCount] =
    React.useState<number>(0);

  const countMax: number = VIDEO_IDS.length;

  React.useEffect(() => {
    let synchronousCount: number = 0;
    forEachVideo(async (video) => {
      console.log('TRANSLATE VIDEO START', synchronousCount, count);
      video = await localizeVideo(video);

      video = await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
        video: video,
        part: VIDEO_PART,
      });

      setCount(++synchronousCount);

      console.log('TRANSLATE VIDEO END', synchronousCount, count);
      return video;
    })
      .catch((err: Response) => {
        err.text().then((text: string) => setErrorMessage(text));
      });
  }, []);

  /**
   * Method to perform an operation on every video given the video ids prop.
   *
   * @param {Function} callback
   */
  async function forEachVideo(callback: (video: Video) => void) {
    const request: ApiYouTubeVideoListGetRequest = {
      part: VIDEO_PART,
      id: VIDEO_IDS.join(','),
    };

    do {
      const response: VideoListResponse = await YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(request);
      const items: Video[] = response.items;

      items.forEach((_) => {
        callback(_); // return is discarded
      });

      request.pageToken = response.nextPageToken;
    } while (request.pageToken);
  }

  /**
   * Adds localizations to the specified video given the languages prop.
   *
   * @param {Video} video
   */
  async function localizeVideo(video: Video): Promise<Video> {
    video.snippet.defaultLanguage = video.snippet.defaultLanguage || 'en';
    video.localizations = video.localizations || {};

    const vidTitle: string = video.snippet.title;
    const vidDescription: string = video.snippet.description;
    const vidDefaultLanguage: string = video.snippet.defaultLanguage;

    for (let i = 0; i < LANGUAGE_CODES.length; i++) {
      const _ = LANGUAGE_CODES[i];
      console.log('LANGUAGE START', video, _);

      const request: ApiTranslationGetRequest = {
        targetLanguageCode: _,
        sourceLanguageCode: vidDefaultLanguage,
      };

      const localization: VideoLocalization = {
        description: await TRANSLATION_API.apiTranslationGet({ ...request, text: vidDescription }),
      };

      if (SHEET_MUSIC_BOSS) {
        localization.title = await substringTranslation(request, 'piano tutorial', vidTitle);
      } else {
        localization.title = await TRANSLATION_API.apiTranslationGet({ ...request, text: vidTitle });
      }

      video.localizations[_] = localization;
      console.log('LANGUAGE END', video, _);
    }

    return video;
  }

  /**
   * A ultility method used to translate and replace a substring within a parent string.
   *
   * @param {ApiTranslationGetRequest} request
   * @param {string} substring
   * @param {string} parent
   */
  async function substringTranslation(request: ApiTranslationGetRequest, substring: string, parent: string): Promise<string> {
    const translatedSubstring = await TRANSLATION_API.apiTranslationGet({ ...request, text: substring });
    const regex: RegExp = new RegExp(substring, 'gi');
    return parent.replace(regex, translatedSubstring);
  }

  const completeFrac: number = (countMax) ? (count / countMax) : 1;

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: Math.floor(completeFrac * 100),
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
          disabled={completeFrac < 1 && !errorMessage}
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

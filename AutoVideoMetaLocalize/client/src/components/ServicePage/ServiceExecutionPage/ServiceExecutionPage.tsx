import { Button, Card, Progress, Row, Typography } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { Page } from '../../Page/Page';
import { AppVideoLocalizeRequest } from '../../../../generated-sources/openapi/models/AppVideoLocalizeRequest';
import { YouTubeVideoApi } from '../../../../generated-sources/openapi';

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
      setComplete(true);
    }).catch((err: Response) => {
      err.text().then((text: string) => setErrorMessage(text));
      setComplete(true);
    });

    //const fetchLocalizationCountInterval = setInterval(() => loadLocalizationCount(), 1000);
    //return clearInterval(fetchLocalizationCountInterval);
  }, []);

  //async function loadLocalizationCount() {
  //  const count: number = await YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizeCountGet();
  //  setLocalizationCount(count);
  //}

  //React.useEffect(() => {
  //  let synchronousCount: number = 0;
  //  forEachVideo(async (video) => {
  //    console.log('TRANSLATE VIDEO START', synchronousCount, count);
  //    video = await localizeVideo(video);

  //    video = await YOUTUBE_VIDEO_API.apiYouTubeVideoUpdatePost({
  //      video: video,
  //      part: VIDEO_PART,
  //    });

  //    setCount(++synchronousCount);

  //    console.log('TRANSLATE VIDEO END', synchronousCount, count);
  //    return video;
  //  })
  //    .catch((err: Response) => {
  //      err.text().then((text: string) => setErrorMessage(text));
  //    });
  //}, []);

  ///**
  // * Method to perform an operation on every video given the video ids prop.
  // *
  // * @param {Function} callback
  // */
  //async function forEachVideo(callback: (video: Video) => void) {
  //  const request: ApiYouTubeVideoListGetRequest = {
  //    part: VIDEO_PART,
  //    id: VIDEO_IDS.join(','),
  //  };

  //  do {
  //    const response: VideoListResponse = await YOUTUBE_VIDEO_API.apiYouTubeVideoListGet(request);
  //    const items: Video[] = response.items;

  //    items.forEach((_) => {
  //      callback(_); // return is discarded
  //    });

  //    request.pageToken = response.nextPageToken;
  //  } while (request.pageToken);
  //}

  ///**
  // * Adds localizations to the specified video given the languages prop.
  // *
  // * @param {Video} video
  // */
  //async function localizeVideo(video: Video): Promise<Video> {
  //  video.snippet.defaultLanguage = video.snippet.defaultLanguage || 'en';
  //  video.localizations = video.localizations || {};

  //  const vidTitle: string = video.snippet.title;
  //  const vidDescription: string = video.snippet.description;
  //  const vidDefaultLanguage: string = video.snippet.defaultLanguage;

  //  for (let i = 0; i < LANGUAGE_CODES.length; i++) {
  //    const translationTargetLanguage = LANGUAGE_CODES[i];
  //    const translationSourceLanguage = vidDefaultLanguage;

  //    console.log('LANGUAGE START', translationTargetLanguage, translationSourceLanguage);

  //    const localization: VideoLocalization = {
  //      description: await TRANSLATION_API.apiTranslationPost({
  //        targetLanguageCode: translationTargetLanguage,
  //        sourceLanguageCode: translationSourceLanguage,
  //        body: vidDescription,
  //      }),
  //    };

  //    if (SHEET_MUSIC_BOSS) {
  //      localization.title = await substringTranslation(translationTargetLanguage, translationSourceLanguage, 'piano tutorial', vidTitle);
  //    } else {
  //      localization.title = await TRANSLATION_API.apiTranslationPost({
  //        targetLanguageCode: translationTargetLanguage,
  //        sourceLanguageCode: translationSourceLanguage,
  //        body: vidTitle,
  //      });
  //    }

  //    video.localizations[translationTargetLanguage] = localization;
  //    console.log('LANGUAGE END', translationTargetLanguage, translationSourceLanguage);
  //  }

  //  return video;
  //}

  ///**
  // * A ultility method used to translate and replace a substring within a parent string.
  // *
  // * @param {string} targetLanguageCode
  // * @param {string} sourceLanguageCode
  // * @param {string} substring
  // * @param {string} parent
  // */
  //async function substringTranslation(targetLanguageCode: string, sourceLanguageCode: string, substring: string, parent: string): Promise<string> {
  //  const translatedSubstring = await TRANSLATION_API.apiTranslationPost({
  //    targetLanguageCode: targetLanguageCode,
  //    sourceLanguageCode: sourceLanguageCode,
  //    body: substring,
  //  });

  //  const regex: RegExp = new RegExp(substring, 'gi');
  //  return parent.replace(regex, translatedSubstring);
  //}

  const completeFrac: number = (localizationCountMax) ? (localizationCount / localizationCountMax) : 1;

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

import { Button, Divider, Progress, Row, Typography, Card } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { YouTubeVideoApi, Video, ApiYouTubeVideoExecuteConfigurationPageGetRequest } from '../../../../../generated-sources/openapi';
import { Page } from '../../Page';
import './style.less';
import { ChannelTranslationConfiguration } from '../../../../ChannelTranslationConfiguration';

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
  //const videos: string[] = props.configuration.videos;

  //console.log(languages, videos);


  const [videos, setVideos] =
    React.useState<Video[]>(null);


  React.useEffect(() => {

  }, []);

  const [exception, setException] =
    React.useState<any>(false);

  const [count, setCount] =
    React.useState<number>(0);

  const [maximumCount, setMaximumCount] =
    React.useState<number>(0);

  React.useEffect(() => {
    const countActual: number = 0;

    let temp: Channel[] = [];
    const req: ApiYouTubeVideoExecuteConfigurationPageGetRequest = {
      id: 
    };

    do {
      const response: ChannelListResponse = await YOUTUBE_CHANNEL_API.apiYouTubeChannelChannelSelectFormGet(req);
      req.pageToken = response.nextPageToken;
      temp = temp.concat(response.items);
    } while (req.pageToken);

    return temp;

    YOUTUBE_VIDEO_API.apiYouTubeVideoExecuteConfigurationPageGet({
      a
    })
      .then((res) => setUser(new ClaimsPrinciple(res)))
      .catch((err) => { });


    for (var i = 0; i < max; i++) {



      // languages for a video are all done in a single update request to save resources
      const indexedVideoId: string = videos[i];

      YOUTUBE_VIDEO_API.apiYouTubeVideoTranslatePost({
        id: indexedVideoId,
        languages: languageCodes,
      })
        .then(() => setCount(i))
        .catch((err: Response) => {
          err.text().then((text) => setException(text));
        });
    }
  }, []);

  const fractionComplete: number = (maximumCount) ? (count / maximumCount) : 1;

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: fractionComplete * 100,
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
          disabled={fractionComplete < 1 && !exception}
          onClick={props.onComplete}>Finish</Button>
      </Row>

      {exception && (
        <Page>
          <Divider>Execution Error</Divider>
          <Row align="middle" justify="center">
            <Card className="max-cell-md">
              <Typography.Paragraph>
                {exception}
              </Typography.Paragraph>
            </Card>
          </Row>
        </Page>
      )}
    </Page>
  );
}

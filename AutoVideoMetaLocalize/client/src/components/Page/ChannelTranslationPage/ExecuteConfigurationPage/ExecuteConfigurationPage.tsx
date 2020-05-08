import {Button, Divider, Progress, Row} from 'antd';
import {ProgressProps} from 'antd/lib/progress';
import * as React from 'react';
import {YouTubeVideoApi} from '../../../../../generated-sources/openapi';
import {Page} from '../../Page';
import {ChannelTranslationConfiguration} from '../ChannelTranslationConfiguration';
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
  const languages: string[] = props.configuration.languages;
  const videos: string[] = props.configuration.videos;

  const [exception, setException] =
    React.useState<any>(false);

  const [count, setCount] =
    React.useState<number>(0);

  const [maximumCount, setMaximumCount] =
    React.useState<number>(0);

  React.useEffect(() => {
    const max = videos.length;
    setMaximumCount(max);

    for (var i = 0; i < max; i++) {
      // languages for a video are all done in a single update request to save resources
      const indexedVideoId: string = videos[i];

      YOUTUBE_VIDEO_API.apiYouTubeVideoTranslatePost({
        id: indexedVideoId,
        languages: languages,
      })
          .then((res) => setCount(i))
          .catch((err) => setException(true));
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
          disabled={fractionComplete < 1}
          onClick={props.onComplete}>Finish</Button>
      </Row>
    </Page>
  );
}

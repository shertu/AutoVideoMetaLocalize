import { Progress, Row } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import * as React from 'react';
import { ApiYouTubeVideoTranslatePostRequest, YouTubeVideoApi } from '../../../../../generated-sources/openapi';
import './style.less';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

/**
 * The content for the step where the user is selecting a channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ExecuteProgress(props: {
  request: ApiYouTubeVideoTranslatePostRequest,
}): JSX.Element {
  const ids: string[] = props.request.id.split(',');

  const [exception, setException] =
    React.useState<boolean>(false);

  const [index, setIndex] =
    React.useState<number>(0);

  React.useEffect(() => {
    for (var i = 0; i < ids.length; i++) {
      YOUTUBE_VIDEO_API.apiYouTubeVideoTranslatePost({
        id: ids[i],
        languages: props.request.languages,
      })
        .then((res) => setIndex(i))
        .catch((err) => setException(true));
    }
  }, []);

  const progressProps: ProgressProps = {
    type: 'circle',
    status: 'active',
    percent: index / ids.length,
  };

  if (exception) {
    progressProps.status = 'exception';
  }

  return (
    <Row align="middle" justify="center">
      <Progress {...progressProps} />
    </Row>
  );
}

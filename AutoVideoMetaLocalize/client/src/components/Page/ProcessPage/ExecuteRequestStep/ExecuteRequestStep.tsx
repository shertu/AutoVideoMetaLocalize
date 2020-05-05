import {Typography} from 'antd';
import * as React from 'react';
import './style.less';
import {Page} from '../../Page';
import {ApiYouTubeVideoTranslatePostRequest} from '../../../../../generated-sources/openapi';

/**
 * The content for the step where the user is selecting a channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ExecuteRequestStep(props: {
  request: ApiYouTubeVideoTranslatePostRequest,
}): JSX.Element {
  return (
    <Page>
      <Typography/>
    </Page >
  );
}

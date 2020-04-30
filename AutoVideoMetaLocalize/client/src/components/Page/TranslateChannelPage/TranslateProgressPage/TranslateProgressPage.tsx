import * as React from 'react';
import './style.less';
import {Divider, Progress} from 'antd';
import {Page} from '../../Page';
import {TranslateChannelApi} from '../../../../../generated-sources/openapi';

const TRANSLATE_CHANNEL_API = new TranslateChannelApi();

/**
 * A page which shows the progress of the AVML process for the current user.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function TranslateProgressPage(props: {
  continuitive?: boolean,
}): JSX.Element {
  const continuitive: boolean = props.continuitive || false;

  React.useEffect(() => {
    if (continuitive) {
      // TRANSLATE_CHANNEL_API
    }
  }, []);

  const [progress, setProgress] =
    React.useState<number>(0);

  return (
    <Page id="translate-channel-page">
      <Divider>Translate Progress</Divider>

      <div className="steps-content">
        {progress && (
          <Progress type="circle" percent={progress} />
        )}
      </div>
    </Page>
  );
}

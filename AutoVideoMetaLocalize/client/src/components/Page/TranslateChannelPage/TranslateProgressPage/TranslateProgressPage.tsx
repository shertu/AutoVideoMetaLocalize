import * as React from 'react';
import './style.less';
import { Divider, Steps, Progress, DatePicker } from 'antd';
import { Page } from '../../Page';

const { Step } = Steps;

const FORM_ITEM_NAMES = {
  PUBLISH_DATE_RANGE: 'publish-date-range',
  LANGUAGE_SELECTION: 'language-selection',
}

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

  const [current, setCurrent] =
    React.useState<number>(null);

  const [progress, setProgress] =
    React.useState<number>(null);

  return (
    <Page id="translate-process">
      <Divider>Translate Progress</Divider>

      <Steps current={current}>
        <Step title="fetch" />
        <Step title="translate" />
        <Step title="update" />
      </Steps>

      <div className="steps-content">
        {progress && (
          <Progress type="circle" percent={progress} />
        )}
      </div>
    </Page>
  );
}

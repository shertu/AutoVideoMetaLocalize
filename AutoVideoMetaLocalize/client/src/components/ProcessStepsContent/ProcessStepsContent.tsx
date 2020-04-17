import * as React from 'react';
import {Steps} from 'antd';
import './style.less';
import {StepCurrentProvider} from './StepCurrentContext/StepCurrentContext';
import { FullWidthCell } from '../FullWidthCell/FullWidthCell';

const {Step} = Steps;

/**
 * The main content of this web application.
 * Contains the steps flow use throughout the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ProcessStepsContent(props: {
  current?: number
}): JSX.Element {
  const [stepCurrent, setStepCurrent] =
    React.useState<number>(0);

  return (
    <StepCurrentProvider value={{
      current: stepCurrent,
      setCurrent: setStepCurrent,
    }}>
      <FullWidthCell className="process-steps-content" size="lg">
        <Steps current={props.current}>
          <Step title="sign in" />
          <Step title="fetch" />
          <Step title="translate" />
          <Step title="update" />
        </Steps>

        <div>Hello World</div>
      </FullWidthCell>
    </StepCurrentProvider>
  );
}

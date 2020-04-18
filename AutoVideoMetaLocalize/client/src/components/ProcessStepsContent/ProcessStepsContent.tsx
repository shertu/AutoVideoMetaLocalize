import * as React from 'react';
import {Steps} from 'antd';
import './style.less';
import {StepCurrentProvider} from './StepCurrentContext/StepCurrentContext';
import { FullWidthCell } from '../FullWidthCell/FullWidthCell';
import { GoogleAuthCard } from './GoogleAuthCard/GoogleAuthCard';

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

  let stepCurrentNode: React.ReactNode;
  switch (stepCurrent) {
    case 0:
      stepCurrentNode = (<GoogleAuthCard/>);
      break;
    default:
      throw `The current step state, ${stepCurrent}, is impossible.`;
  }

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

        {stepCurrentNode}
      </FullWidthCell>
    </StepCurrentProvider>
  );
}

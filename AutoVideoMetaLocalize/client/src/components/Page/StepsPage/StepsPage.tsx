import * as React from 'react';
import { Steps, Button, Card, Row } from 'antd';
import './style.less';
import { StepsProvider } from './StepsContext/StepsContext';
import { GoogleAuthPage } from '../GoogleAuthPage/GoogleAuthPage';
import { FetchVideosPage } from '../FetchVideosPage/FetchVideosPage';
import { Page } from '../Page';

const { Step } = Steps;

interface StepItem {
  title: string,
  node: React.ReactNode,
}

const steps: Array<StepItem> = [{
  title: "sign in",
  node: (<GoogleAuthPage />)
}, {
  title: "fetch",
  node: (<FetchVideosPage />)
}, {
  title: "translate",
  node: (<div />)
}, {
  title: "update",
  node: (<div />)
}]

/**
 * The main content of this web application.
 * Contains the steps flow use throughout the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function StepsPage(): JSX.Element {
  const [current, setCurrent] =
    React.useState<number>(0);

  const [currentMax, setCurrentMax] =
    React.useState<number>(0);

  const currentStepItem: StepItem = steps[current];

  return (
    <Page id="steps-page">
      <Steps current={current} onChange={setCurrent} style={{ padding: 16 }}>
        {steps.map((item, index) => (
          <Step key={item.title} title={item.title} disabled={index > currentMax} />
        ))}
      </Steps>

      <StepsProvider value={{
        current: current,
        setCurrent: setCurrent,
        currentMax: currentMax,
        setCurrentMax: setCurrentMax,
      }}>
        {currentStepItem.node}
      </StepsProvider>
    </Page>
  );
}

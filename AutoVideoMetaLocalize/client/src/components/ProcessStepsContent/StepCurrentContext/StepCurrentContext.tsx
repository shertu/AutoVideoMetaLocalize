import * as React from 'react';
import './style.less';

const StepCurrentContext = React.createContext<{
  current: number,
  setCurrent:(number) => void
      }>(null);

export const StepCurrentProvider = StepCurrentContext.Provider;
export const StepCurrentConsumer = StepCurrentContext.Consumer;
export default StepCurrentContext;

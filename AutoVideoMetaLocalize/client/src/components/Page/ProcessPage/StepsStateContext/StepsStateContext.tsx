import * as React from 'react';
import './style.less';

const StepsStateContext = React.createContext<{
  value: number,
  setValue: React.Dispatch<React.SetStateAction<number>>
}>(null);

export const StepsStateProvider = StepsStateContext.Provider;
export const StepsStateConsumer = StepsStateContext.Consumer;
export default StepsStateContext;

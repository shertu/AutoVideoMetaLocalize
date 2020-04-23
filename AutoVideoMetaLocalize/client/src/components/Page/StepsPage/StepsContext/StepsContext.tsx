import * as React from 'react';
import './style.less';

const StepsContext = React.createContext<{
  current: number,
  setCurrent: React.Dispatch<React.SetStateAction<number>>,
  currentMax: number,
  setCurrentMax: React.Dispatch<React.SetStateAction<number>>,
}>(null);

export const StepsProvider = StepsContext.Provider;
export const StepsConsumer = StepsContext.Consumer;
export default StepsContext;

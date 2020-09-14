import * as React from 'react';
import EventStates from '../../../event-states';

const ExecutionStateContext = React.createContext<EventStates>(undefined);

export const ExecutionStateProvider = ExecutionStateContext.Provider;
export const ExecutionStateConsumer = ExecutionStateContext.Consumer;
export default ExecutionStateContext;

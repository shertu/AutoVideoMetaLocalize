import * as React from 'react';
import {ClaimsPrinciple} from '../../security/claims';
import './style.less';

const UserContext = React.createContext<ClaimsPrinciple>(null);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;

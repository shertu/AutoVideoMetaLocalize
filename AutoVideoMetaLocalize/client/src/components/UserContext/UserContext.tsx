import * as React from 'react';
import './style.less';
import { ClaimsPrinciple } from '../../security/claims';

const UserContext = React.createContext<ClaimsPrinciple>(null);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;

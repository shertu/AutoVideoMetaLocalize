import * as React from 'react';
import {AuthorizationUser} from '../../authorization';
import './style.less';

const UserContext = React.createContext<AuthorizationUser>(null);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;

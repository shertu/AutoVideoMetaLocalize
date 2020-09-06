import * as React from 'react';
import { GetClaimsPrincipleResult } from '../../../generated-sources/openapi';

const UserContext = React.createContext<GetClaimsPrincipleResult>(null);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;

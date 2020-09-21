import * as React from 'react';
import {GetClaimsPrincipleResult} from '../../../generated-sources/openapi';

/** The react context used to store user authentication and authorization information. */
const UserContext = React.createContext<GetClaimsPrincipleResult>(undefined);

export default UserContext;

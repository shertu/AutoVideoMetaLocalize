import {message} from 'antd';
import * as React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {AccountApi, GetClaimsPrincipleResult} from '../../../generated-sources/openapi';
import {UserProvider} from '../UserContext/UserContext';
import {AppLayout} from './AppLayout/AppLayout';

const ACCOUNT_API: AccountApi = new AccountApi();

const UNAUTHORIZED_USER: GetClaimsPrincipleResult = {
  claims: null,
  isAuthenticated: false,
};

/**
 * The highest level react component.
 *
 * @return {JSX.Element}
 */
export function App(): JSX.Element {
  const [user, setUser] =
    React.useState<GetClaimsPrincipleResult>(undefined);

  React.useEffect(() => {
    ACCOUNT_API.apiAccountGet()
        .then((res) => setUser(res))
        .catch((err: Response) => {
          if (err.status == 401) {
            setUser(UNAUTHORIZED_USER);
          } else {
            message.error('An unexpected error occured while fetching user information.');
          }
        });
  }, []);

  return (
    <UserProvider value={user}>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

// The following LOC renders the app component to the DOM.
render(<App />, document.getElementById('app'));

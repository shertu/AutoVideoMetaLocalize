import * as React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {AccountApi, GetClaimsPrincipleResult} from '../../../generated-sources/openapi';
import {UserProvider} from '../UserContext/UserContext';
import {AppLayout} from './AppLayout/AppLayout';


const ACCOUNT_API: AccountApi = new AccountApi();

/**
 * The highest-level react component.
 *
 * @return {JSX.Element}
 */
export function App(): JSX.Element {
  const [user, setUser] =
    React.useState<GetClaimsPrincipleResult>(null);

  React.useEffect(() => {
    ACCOUNT_API.apiAccountGet()
      .then((res) => setUser(res))
      .catch((err) => {/* do nothing */ });
  }, []);

  return (
    <UserProvider value={user}>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

// Render the application to the DOM.
render(<App />, document.getElementById('app'));

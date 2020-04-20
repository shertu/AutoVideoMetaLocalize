import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './style.less';
import { AppLayout } from './AppLayout/AppLayout';
import { UserProvider } from '../UserContext/UserContext';
import { AccountApi } from '../../../generated-sources/openapi';

const ACCOUNT_API: AccountApi = new AccountApi();

/**
 * The highest-level react component.
 *
 * @return {JSX.Element}
 */
export function App(): JSX.Element {
  //const [user, setUser] =
  //  React.useState<AuthorizationUser>(null);

  //React.useEffect(() => {
  //  ACCOUNT_API.ac
  //    .then((res) => setUser(new AuthorizationUser(res)))
  //    .catch(err => setUser(null));
  //}, []);

  //console.log('authorization user', user);

  return (
    <UserProvider value={null}>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

// Render the application to the DOM.
render(<App />, document.getElementById('app'));

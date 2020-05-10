import * as React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {AccountApi} from '../../../generated-sources/openapi';
import {ClaimsPrinciple} from '../../security';
import {UserProvider} from '../UserContext/UserContext';
import {AppLayout} from './AppLayout/AppLayout';
import './style.less';

const ACCOUNT_API: AccountApi = new AccountApi();

/**
 * The highest-level react component.
 *
 * @return {JSX.Element}
 */
export function App(): JSX.Element {
  const [user, setUser] =
    React.useState<ClaimsPrinciple>(null);

  React.useEffect(() => {
    ACCOUNT_API.apiAccountGet()
        .then((res) => setUser(new ClaimsPrinciple(res)))
        .catch((err) => { });
  }, []);

  return (
    <UserProvider value={user}>
      <Router>
        <div />
      </Router>
    </UserProvider>
  );
}
//<AppLayout />

// Render the application to the DOM.
render(<App />, document.getElementById('app'));

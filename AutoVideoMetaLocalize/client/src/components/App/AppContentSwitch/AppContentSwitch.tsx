import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import routes from '../../../routes';
import {NoRouteMatchError} from '../../NoRouteMatchError/NoRouteMatchError';
import './style.less';
import {PrivacyPolicyPage} from '../../Page/PrivacyPolicyPage/PrivacyPolicyPage';
import {HomePage} from '../../Page/HomePage/HomePage';
import {ProcessPage} from '../../Page/ProcessPage/ProcessPage';

/**
 * The main route switch in the web application.
 *
 * @return {JSX.Element}
 */
export function AppContentSwitch(): JSX.Element {
  return (
    <Switch>
      <Route exact path={routes.ROUTE_HOME}>
        <HomePage />
      </Route>
      <Route exact path={routes.ROUTE_PROCESS}>
        <ProcessPage />
      </Route>
      <Route exact path={routes.ROUTE_PRIVACY_POLICY}>
        <PrivacyPolicyPage />
      </Route>
      <Route>
        <NoRouteMatchError />
      </Route>
    </Switch>
  );
}

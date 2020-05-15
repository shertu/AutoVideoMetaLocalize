import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../../../routes';
import { ChannelTranslationPage } from '../../ChannelTranslationPage/ChannelTranslationPage';
import { HomePage } from '../../HomePage/HomePage';
import { NoRouteMatchError } from '../../NoRouteMatchError/NoRouteMatchError';
import { PrivacyPolicyPage } from '../../PrivacyPolicyPage/PrivacyPolicyPage';
import './style.less';

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
        <ChannelTranslationPage />
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

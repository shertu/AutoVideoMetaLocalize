import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import routes from '../../../routes';
import {NoRouteMatchError} from '../../NoRouteMatchError/NoRouteMatchError';
import {HomePage} from '../../Page/HomePage/HomePage';
import {PrivacyPolicyPage} from '../../Page/PrivacyPolicyPage/PrivacyPolicyPage';
import './style.less';
import { ChannelTranslationPage } from '../../Page/ChannelTranslationPage/ChannelTranslationPage';

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

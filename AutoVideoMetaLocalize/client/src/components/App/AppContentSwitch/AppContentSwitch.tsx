import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../../../routes';
import { NoRouteMatchError } from '../../NoRouteMatchError/NoRouteMatchError';
import './style.less';
import { ProcessStepsContent } from '../../ProcessStepsContent/ProcessStepsContent';
import { PrivacyPolicyPage } from '../../PrivacyPolicyPage/PrivacyPolicyPage';

/**
 * The main switch in the web application.
 *
 * @return {JSX.Element}
 */
export function AppContentSwitch(): JSX.Element {
  return (
    <Switch>
      <Route exact path={routes.ROUTE_HOME}>
        <ProcessStepsContent />
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

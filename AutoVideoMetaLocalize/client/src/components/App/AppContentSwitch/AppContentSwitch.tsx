import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import routes from '../../../routes';
import {NoRouteMatchError} from '../../LogMessage/NoRouteMatchError/NoRouteMatchError';
import './style.less';
import {MailToMe} from '../../MailToMe/MailToMe';

/**
 * Switches between the various react pages in the application.
 */
export function AppContentSwitch(): JSX.Element {
  return (
    <Switch>
      <Route exact path={routes.ROUTE_HOME}>
        <MailToMe subject="I love Andrew">Sheet Music Boss</MailToMe>
      </Route>
      <Route>
        <NoRouteMatchError />
      </Route>
    </Switch>
  );
}

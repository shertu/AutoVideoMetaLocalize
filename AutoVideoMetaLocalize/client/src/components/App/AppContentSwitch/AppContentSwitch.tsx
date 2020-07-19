import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../../../routes';
import { ServicePage } from '../../ServicePage/ServicePage';
import { HomePage } from '../../HomePage/HomePage';
import { PrivacyPolicyPage } from '../../PrivacyPolicyPage/PrivacyPolicyPage';
import { Result, Typography } from 'antd';
import { MailToMe } from '../../MailToMe/MailToMe';

const { Paragraph } = Typography;

const ERROR_TITLE = 'client-side no route match error';

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
        <ServicePage />
      </Route>
      <Route exact path={routes.ROUTE_PRIVACY_POLICY}>
        <PrivacyPolicyPage />
      </Route>
      <Route>
        <Result
          status="404"
          title={ERROR_TITLE}
          extra={
            <Paragraph>
              Please&nbsp;<MailToMe subject={ERROR_TITLE}>report the problem to a developer.</MailToMe>
            </Paragraph>
          }
        />
      </Route>
    </Switch>
  );
}

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../../../routes';
import { HomePage } from '../../HomePage/HomePage';
import { PrivacyPolicyPage } from '../../PrivacyPolicyPage/PrivacyPolicyPage';
import { Result, Typography } from 'antd';
import { MailToMe } from '../../MailToMe/MailToMe';
import { ServiceFormPage } from '../../ServiceFormPage/ServiceFormPage';

const { Paragraph } = Typography;

/**
 * The main content router in the web application.
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
        <ServiceFormPage />
      </Route>
      <Route exact path={routes.ROUTE_PRIVACY_POLICY}>
        <PrivacyPolicyPage />
      </Route>
      <Route>
        <Result
          status="404"
          title='client-side no route match error'
          extra={
            <Paragraph>
              Please&nbsp;<MailToMe subject={`An error occured when I visited ${window.location.href}`}>report this error to a developer.</MailToMe>
            </Paragraph>
          }
        />
      </Route>
    </Switch>
  );
}

import {Result, Typography} from 'antd';
import * as React from 'react';
import Mailto from 'react-mailto.js';
import {Route, Switch} from 'react-router-dom';
import {ApplicationRouteInfo} from '../../../constants';
import {LandingPage} from '../../LandingPage/LandingPage';
import {PrivacyPolicyPage} from '../../PrivacyPolicyPage/PrivacyPolicyPage';
import {ServiceFormPage} from '../../ServiceFormPage/ServiceFormPage';

const {Paragraph} = Typography;

/**
 * A switch component used to route URLs to core pages in the application.
 *
 * @return {JSX.Element}
 */
export function AppContentSwitch(): JSX.Element {
  return (
    <Switch>
      <Route exact path={ApplicationRouteInfo.Home}>
        <LandingPage />
      </Route>

      <Route exact path={ApplicationRouteInfo.ROUTE_PROCESS}>
        <ServiceFormPage />
      </Route>

      <Route exact path={ApplicationRouteInfo.ROUTE_PRIVACY_POLICY}>
        <PrivacyPolicyPage />
      </Route>

      <Route>
        <Result
          status="404"
          title='client-side no route match error'
          extra={
            <Paragraph>
              Please&nbsp;<Mailto subject={`An error occured when I visited ${window.location.href}`} to="djared.xeknau@outlook.com" >report this error to a developer.</Mailto>
            </Paragraph>
          }
        />
      </Route>
    </Switch>
  );
}

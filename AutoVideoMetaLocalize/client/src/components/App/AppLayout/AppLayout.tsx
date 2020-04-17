import {Layout} from 'antd';
import * as React from 'react';
import {useRouteMatch} from 'react-router-dom';

import {AppContentSwitch} from '../AppContentSwitch/AppContentSwitch';
import './style.less';
import routes from '../../../routes';
import {RouteBreadcrumb} from '../../RouteBreadcrumb/RouteBreadcrumb';

const {Header, Content} = Layout;

/**
 * Describes the general structure of the applcation.
 */
export function AppLayout(): JSX.Element {
  // check if the current page is the index page
  const isHomePage: boolean = useRouteMatch(routes.ROUTE_HOME).isExact;

  // render the element
  return (
    <Layout className="app-layout">
      {!isHomePage &&
        <Header>
          <RouteBreadcrumb/>
        </Header>
      }

      <Content>
        <AppContentSwitch />
      </Content>
    </Layout>
  );
}

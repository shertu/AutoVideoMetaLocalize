import {Avatar, Button, Layout, Space} from 'antd';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {ApplicationRouteInfo} from '../../../constants';
import {MaxCell} from '../../MaxCell/MaxCell';
import {AppContentSwitch} from '../AppContentSwitch/AppContentSwitch';
import './style.less';

const {Content, Footer} = Layout;

/**
 * A layout component used to describe general structure of the application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  // const isHomePage: boolean = useRouteMatch(ApplicationRouteInfo.Home).isExact;
  return (
    <Layout id="app-layout">
      <Content>
        <MaxCell id="content-viewport">
          <AppContentSwitch />
        </MaxCell>
      </Content>
      <Footer>
        <Space className="max-height" align="center">
          <Link to={ApplicationRouteInfo.ROUTE_HOME}>
            <Avatar shape="square" size={64} src="https://i.imgur.com/wU7ftuX.png" />
          </Link>
          <Link to={ApplicationRouteInfo.ROUTE_PRIVACY_POLICY}>
            <Button type="link">Privacy Policy</Button>
          </Link>
        </Space>
      </Footer>
    </Layout>
  );
}

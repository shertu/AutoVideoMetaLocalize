import {Layout, Row, Button, Avatar} from 'antd';
import * as React from 'react';
import {AppContentSwitch} from '../AppContentSwitch/AppContentSwitch';
import {Link} from 'react-router-dom';
import routes from '../../../routes';
import {Page} from '../../Page/Page';

const {Content, Footer} = Layout;

/**
 * The general layout or structure of the web application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Content style={{padding: '40px 8px'}}>
        <Row id="content-alignment" justify="center">
          <Page id="content-view">
            <AppContentSwitch />
          </Page>
        </Row>
      </Content>
      <Footer>
        <Link to={routes.ROUTE_HOME}>
          <Avatar shape="square" size={64} src="https://i.imgur.com/wU7ftuX.png"/>
        </Link>
        <Link to={routes.ROUTE_PRIVACY_POLICY}>
          <Button type="link">Privacy Policy</Button>
        </Link>
      </Footer>
    </Layout>
  );
}

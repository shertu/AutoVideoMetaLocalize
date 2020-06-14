import { Layout, Row, Button } from 'antd';
import * as React from 'react';
import { AppContentSwitch } from '../AppContentSwitch/AppContentSwitch';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

const { Content, Footer } = Layout;

/**
 * The general layout or structure of the web application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '40px 8px' }}>
        <Row id="content-alignment" justify="center">
          <AppContentSwitch />
        </Row>
      </Content>
      <Footer>
        <Link to={routes.ROUTE_PRIVACY_POLICY}>
          <Button type="link">Privacy Policy</Button>
        </Link>
      </Footer>
    </Layout>
  );
}

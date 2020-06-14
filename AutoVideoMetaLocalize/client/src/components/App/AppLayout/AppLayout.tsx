import { Layout, Row, Typography } from 'antd';
import * as React from 'react';
import { Page } from '../../Page/Page';
import { AppContentSwitch } from '../AppContentSwitch/AppContentSwitch';

const { Content } = Layout;

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
    </Layout>
  );
}

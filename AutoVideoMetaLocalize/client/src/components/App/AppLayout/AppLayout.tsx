import { Layout, Row } from 'antd';
import * as React from 'react';
import { AppContentSwitch } from '../AppContentSwitch/AppContentSwitch';
import './style.less';

const { Content } = Layout;

/**
 * The general layout or structure of the web application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Row className="content-alignment" justify="center">
          <AppContentSwitch />
        </Row>
      </Content>
    </Layout>
  );
}

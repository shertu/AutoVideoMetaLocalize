import {Layout, Row, Typography} from 'antd';
import * as React from 'react';
import {Page} from '../../Page/Page';
import {AppContentSwitch} from '../AppContentSwitch/AppContentSwitch';


const {Title} = Typography;

const {Content} = Layout;

/**
 * The general layout or structure of the web application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Content style={{padding: 8}}>
        <Row className="content-alignment" justify="center">
          <Page>
            <Title style={{textAlign: 'center'}}>Auto Video Meta Localize</Title >
            <AppContentSwitch />
          </Page>
        </Row>
      </Content>
    </Layout>
  );
}

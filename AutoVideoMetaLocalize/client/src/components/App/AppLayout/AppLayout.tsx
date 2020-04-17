import {Layout} from 'antd';
import * as React from 'react';
import {AppContentSwitch} from '../AppContentSwitch/AppContentSwitch';
import './style.less';

const {Content} = Layout;

/**
 * The general layout or structure of the web application, e.g. main, header, footer, etc.
 *
 * @return {JSX.Element}
 */
export function AppLayout(): JSX.Element {
  return (
    <Layout>
      <Content>
        <AppContentSwitch />
      </Content>
    </Layout>
  );
}

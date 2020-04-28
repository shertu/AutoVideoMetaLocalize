import * as React from 'react';
import './style.less';
import { Page } from '../Page';
import { Channel } from '../../../../generated-sources/openapi';
import { PageHeader, Form, Select, DatePicker, Button, Row } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { TranslateProgressPage } from './TranslateProgressPage/TranslateProgressPage';

const { RangePicker } = DatePicker;

const FORM_ITEM_NAMES = {
  PUBLISH_DATE_RANGE: 'publish-date-range',
  LANGUAGE_SELECTION: 'language-selection',
}

/**
 * A page which contains options and progress information for the AVML process.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function TranslateChannelPage(props: {
  channel: Channel,
  setSelectedChannel: React.Dispatch<React.SetStateAction<Channel>>
}): JSX.Element {
  async function onFinish(values: Store): Promise<void> {
    console.log(values);
  }

  async function onBack() {
    props.setSelectedChannel(null)
  }

  return (
    <Page id="translate-channel-page">
      <PageHeader
        className="site-page-header"
        title="Options"
        onBack={onBack}
      />

      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Publish Date Range"
          name={FORM_ITEM_NAMES.PUBLISH_DATE_RANGE}
        >
          <RangePicker />
        </Form.Item>

        <Form.Item
          label="Languages"
          name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
          rules={[{ required: true, message: 'please select at least one language' }]}
        >
          <Select />
        </Form.Item>

        <Row align="middle" justify="end">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Row>
      </Form>

      <TranslateProgressPage continuitive={false} />
    </Page>
  );
}

import { Button, Form, Row, Collapse, Checkbox, Space } from 'antd';
import * as React from 'react';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { FormProps } from 'antd/lib/form';
import { YouTubeCombo } from './YouTubeCombo/YouTubeCombo';
import EventStates from '../../../event-states';
import ExecutionStateContext from '../ExecutionStateContext/ExecutionStateContext';
import COOKIE_NAMES from '../../../cookie-names';

/** */
export const ServiceFormItemNames = Object.freeze({
  LANGUAGE_SELECT: 'language-selection',
  YOUTUBE_CHANNEL_RADIO_GROUP: 'channel-selection',
  YOUTUBE_VIDEO_SELECTION_TABLE: 'video-selection',
  SMB_CHECKBOX: 'smb-checkbox',
});

export interface ServiceFormValues {
  language_select: string[],
  youtube_channel_radio_group: string[],
  youtube_video_selection_table: string[],
  smb_checkbox: boolean,
}

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceForm(props: {
  onFinish: (values: ServiceFormValues) => void
}): JSX.Element {
  const { onFinish } = props;

  const [form] = Form.useForm<ServiceFormValues>();

  const executionState: EventStates = React.useContext(ExecutionStateContext);

  const languageSelectCookieValue: string = cookie.parse(document.cookie)[ServiceFormItemNames.LANGUAGE_SELECT] || '';

  /** Clears the form's fields and the language cookie. */
  function onClearForm() {
    form.setFieldsValue({
      language_select: null,
      youtube_video_selection_table: null,
      smb_checkbox: null,
    });

    document.cookie = cookie.serialize(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, '');
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        label="Languages"
        name={ServiceFormItemNames.LANGUAGE_SELECT}
        rules={[{ required: true, message: 'Please select at least one language.' }]}
        initialValue={languageSelectCookieValue.split(',')}
      >
        <LanguageSelect />
      </Form.Item>

      <Form.Item
        label="Videos"
        name={ServiceFormItemNames.YOUTUBE_VIDEO_SELECTION_TABLE}
        rules={[{ required: true, message: 'Please select at least one video.' }]}
      >
        <YouTubeCombo />
      </Form.Item>

      <Collapse className="ant-form-item">
        <Collapse.Panel header="Additional Options" key="1">
          <Form.Item
            name={ServiceFormItemNames.SMB_CHECKBOX}
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Sheet Music Boss</Checkbox>
          </Form.Item>
        </Collapse.Panel>
      </Collapse>

      <Row justify="end">
        <Space>
          <Button onClick={() => onClearForm()}>Clear</Button>

          <Button type="primary" htmlType="submit" disabled={executionState === EventStates.continuitive}>Execute</Button>
        </Space>
      </Row>
    </Form>
  );
}

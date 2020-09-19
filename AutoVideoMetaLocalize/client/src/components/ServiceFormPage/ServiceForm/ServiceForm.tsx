import { Button, Checkbox, Collapse, Form, Row, Space } from 'antd';
import * as cookie from 'cookie';
import * as React from 'react';
import COOKIE_NAMES, { readJsonCookie, writeJsonCookie } from '../../../cookie-names';
import EventStates from '../../../event-states';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import { YouTubeCombo } from './YouTubeCombo/YouTubeCombo';

/** An interface to work with the form's values. */
export interface ServiceFormValues {
  languageSelect: string[],
  youtubeChannelRadioGroup: string[],
  youtubeVideoSelectionTable: string[],
  smbCheckbox: boolean,
}

/** The names of the form's items used to map to its values. */
export const ServiceFormItemNames = Object.freeze({
  LANGUAGE_SELECT: 'languageSelect',
  YOUTUBE_CHANNEL_RADIO_GROUP: 'youtubeChannelRadioGroup',
  YOUTUBE_VIDEO_SELECTION_TABLE: 'youtubeVideoSelectionTable',
  SMB_CHECKBOX: 'smbCheckbox',
});

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceForm(props: {
  onFinish?: (values: ServiceFormValues) => void,
  serviceExecutionState?: EventStates,
}): JSX.Element {
  const { onFinish, serviceExecutionState } = props;

  const [form] = Form.useForm<ServiceFormValues>();

  const languageSelectInitialValue = readJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES);
  console.log(languageSelectInitialValue);

  /** Clears the form's fields and the language cookie. */
  function onClearForm() {
    form.resetFields();

    const newLanguageSelectInitialValue: string[] = [];
    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, newLanguageSelectInitialValue);

    form.setFieldsValue({
      languageSelect: newLanguageSelectInitialValue,
    })
  }

  //initialValue = { languageSelectInitialValue }

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
        rules={[{ required: false, message: 'Please select at least one language.' }]}
      >
        <LanguageSelect />
      </Form.Item>

      <Form.Item
        label="Videos"
        name={ServiceFormItemNames.YOUTUBE_VIDEO_SELECTION_TABLE}
        rules={[{ required: false, message: 'Please select at least one video.' }]}
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

          <Button type="primary" htmlType="submit" disabled={serviceExecutionState === EventStates.continuitive}>Execute</Button>
        </Space>
      </Row>
    </Form>
  );
}

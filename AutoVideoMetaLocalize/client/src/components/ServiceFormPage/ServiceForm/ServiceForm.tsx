import {Button, Checkbox, Collapse, Form, Row, Space} from 'antd';
import * as React from 'react';
import COOKIE_NAMES, {readJsonCookie, writeJsonCookie} from '../../../cookie-names';
import {LanguageSelect} from './LanguageSelect/LanguageSelect';
import {MineChannelVideoUploadsCombo} from './YouTubeCombo/MineChannelVideoUploadsCombo';

export interface ServiceFormValues {
  languages: string[],
  videos: string[],
  sheetMusicBoss: boolean,
}

const ServiceFormItemNames = Object.freeze({
  LANGUAGE_SELECT: 'languages',
  YOUTUBE_VIDEO_SELECTION_TABLE: 'videos',
  SMB_CHECKBOX: 'sheetMusicBoss',
});

/**
 * A form componnent used to manage input for the web application's localization service.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ServiceForm(props: {
  onFinish?: (values: ServiceFormValues) => void,
  submitDisabled?: boolean,
}): JSX.Element {
  const {onFinish, submitDisabled} = props;

  /** The form ref used to maniuplate the form instance's values. */
  const [form] = Form.useForm<ServiceFormValues>();

  /** The initial value of the languge select form item. */
  const languageSelectInitialValue = readJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES);

  /** The event called when the form is cleared. */
  function onClearForm() {
    writeJsonCookie(COOKIE_NAMES.SERVICE_FORM_LANGUAGES, []);

    form.setFieldsValue({
      languages: [],
      videos: [],
      sheetMusicBoss: false,
    });
  }

  return (
    <Form
      labelCol={{span: 4}}
      wrapperCol={{span: 20}}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        label="Languages"
        name={ServiceFormItemNames.LANGUAGE_SELECT}
        rules={[{required: true, message: 'Please select at least one language.'}]}
        initialValue={languageSelectInitialValue}
      >
        <LanguageSelect />
      </Form.Item>

      <Form.Item
        label="Videos"
        name={ServiceFormItemNames.YOUTUBE_VIDEO_SELECTION_TABLE}
        rules={[{required: true, message: 'Please select at least one video.'}]}
      >
        <MineChannelVideoUploadsCombo />
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

          <Button type="primary" htmlType="submit" disabled={submitDisabled}>Execute</Button>
        </Space>
      </Row>
    </Form>
  );
}

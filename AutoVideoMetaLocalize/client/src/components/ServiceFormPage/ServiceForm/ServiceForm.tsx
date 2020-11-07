import {Button, Checkbox, Collapse, Form, Row, Space} from 'antd';
import * as React from 'react';
import {AppVideoLocalizeRequest} from '../../../../generated-sources/openapi';
import {CookiesNames} from '../../../constants';
import {readJsonCookie, writeJsonCookie} from '../../../json-cookie';
import {LanguageSelect} from './LanguageSelect/LanguageSelect';
import {MineChannelVideoUploadsCombo} from './YouTubeCombo/MineChannelVideoUploadsCombo';

export interface ServiceFormValues extends AppVideoLocalizeRequest {
}

export const SERVICE_FORM_DEFAULT_VALUES: ServiceFormValues = {
  translationLanguageCollection: [],
  mineChannelVideoUploadCollection: [],
  nullifyVideoLocalizations: false,
};

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
  const languageSelectInitialValue: string[] = readJsonCookie<string[]>(CookiesNames.SERVICE_FORM_LANGUAGES);

  /** The event called when the form is cleared. */
  function onClearForm() {
    writeJsonCookie<string[]>(CookiesNames.SERVICE_FORM_LANGUAGES, SERVICE_FORM_DEFAULT_VALUES.translationLanguageCollection);
    form.setFieldsValue(SERVICE_FORM_DEFAULT_VALUES);
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
        name="translationLanguageCollection"
        rules={[{required: true, message: 'Please select at least one language.'}]}
        initialValue={languageSelectInitialValue}
      >
        <LanguageSelect />
      </Form.Item>

      <Form.Item
        label="Videos"
        name="mineChannelVideoUploadCollection"
        rules={[{required: true, message: 'Please select at least one video.'}]}
      >
        <MineChannelVideoUploadsCombo />
      </Form.Item>

      <Collapse className="ant-form-item">
        <Collapse.Panel header="Additional Options" key="1">
          <Form.Item
            name="nullifyVideoLocalizations"
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Nullify Existing Video Localizations</Checkbox>
          </Form.Item>
        </Collapse.Panel>
      </Collapse>

      <Row justify="end">
        <Space>
          <Button onClick={onClearForm}>Clear</Button>

          <Button type="primary" htmlType="submit" disabled={submitDisabled}>Execute</Button>
        </Space>
      </Row>
    </Form>
  );
}

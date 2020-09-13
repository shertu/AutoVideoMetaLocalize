import { Button, Form, Row, Collapse, Checkbox, Space } from 'antd';
import * as React from 'react';
import { AuthorizedContent } from '../../AuthorizedContent/AuthorizedContent';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { FormProps } from 'antd/lib/form';
import { YouTubeCombo } from './YouTubeCombo/YouTubeCombo';
import ServiceFormItemNames from '../ServiceFormItemNames';

export interface ServiceFormProps<Values = any> extends FormProps<Values> {
  onClearFormInputs?: () => void;
  submitButtonDisabled?: boolean;
}

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceForm<Values = any>(props: ServiceFormProps<Values>): JSX.Element {
  const { onClearFormInputs, submitButtonDisabled, form } = props;

  const languageSelectionCookieValue: string = cookie.parse(document.cookie)[ServiceFormItemNames.LANGUAGE_SELECTION];
  const languageSelectionInitialValue: string[] = languageSelectionCookieValue ? languageSelectionCookieValue.split(',') : [];

  /** Clears the form's fields and the language cookie. */
  function onClearForm() {
    const fieldValues: { [id: string]: any; } = {
      [ServiceFormItemNames.LANGUAGE_SELECTION]: [],
      [ServiceFormItemNames.VIDEO_SELECTION]: [],
      [ServiceFormItemNames.SMB_CHECKBOX]: false,
    };

    form.setFields([
      { name: ServiceFormItemNames.LANGUAGE_SELECTION, value: undefined },
      { name: ServiceFormItemNames.VIDEO_SELECTION, value: undefined },
      { name: ServiceFormItemNames.SMB_CHECKBOX, value: false },
    ])

    document.cookie = cookie.serialize(ServiceFormItemNames.LANGUAGE_SELECTION, null);
  }

  return (
    <AuthorizedContent>
      <Form {...props}>
        <Form.Item
          label="Languages"
          name={ServiceFormItemNames.LANGUAGE_SELECTION}
          rules={[{ required: true, message: 'Please select at least one language.' }]}
          initialValue={languageSelectionInitialValue}
        >
          <LanguageSelect
            mode="multiple"
            className="max-cell-sm"
          />
        </Form.Item>

        <YouTubeCombo />

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
            {onClearFormInputs &&
              <Button onClick={onClearFormInputs}>Clear</Button>
            }

            <Button type="primary" htmlType="submit" disabled={submitButtonDisabled}>Execute</Button>
          </Space>
        </Row>
      </Form>
    </AuthorizedContent>
  );
}

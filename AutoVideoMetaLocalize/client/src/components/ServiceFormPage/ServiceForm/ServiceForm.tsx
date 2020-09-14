import { Button, Form, Row, Collapse, Checkbox, Space } from 'antd';
import * as React from 'react';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { FormProps } from 'antd/lib/form';
import { YouTubeCombo } from './YouTubeCombo/YouTubeCombo';
import EventStates from '../../../event-states';
import ExecutionStateContext from '../ExecutionStateContext/ExecutionStateContext';

/** */
export const ServiceFormItemNames = Object.freeze({
  LANGUAGE_SELECT: 'language-selection',
  YOUTUBE_CHANNEL_RADIO_GROUP: 'channel-selection',
  YOUTUBE_VIDEO_SELECTION_TABLE: 'video-selection',
  SMB_CHECKBOX: 'smb-checkbox',
});

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceForm<Values = any>(props: FormProps<Values>): JSX.Element {
  const { form } = props;

  const executionState: EventStates = React.useContext(ExecutionStateContext);

  const languageSelectCookieValue: string = cookie.parse(document.cookie)[ServiceFormItemNames.LANGUAGE_SELECT];
  const languageSelectInitialValue: string[] = languageSelectCookieValue ? languageSelectCookieValue.split(',') : [];

  /** Clears the form's fields and the language cookie. */
  function onClearForm() {
    form.setFields([
      { name: ServiceFormItemNames.LANGUAGE_SELECT, value: undefined },
      { name: ServiceFormItemNames.YOUTUBE_VIDEO_SELECTION_TABLE, value: undefined },
      { name: ServiceFormItemNames.SMB_CHECKBOX, value: false },
    ])

    document.cookie = cookie.serialize(ServiceFormItemNames.LANGUAGE_SELECT, null);
  }

  return (
    <Form {...props}>
      <Form.Item
        label="Languages"
        name={ServiceFormItemNames.LANGUAGE_SELECT}
        rules={[{ required: true, message: 'Please select at least one language.' }]}
        initialValue={languageSelectInitialValue}
      >
        <LanguageSelect
          mode="multiple"
          className="max-cell-sm"
        />
      </Form.Item>

      <YouTubeCombo
        YouTubeVideoSelectionTableFormItemName={ServiceFormItemNames.YOUTUBE_VIDEO_SELECTION_TABLE}
        YouTubeChannelRadioGroupFormItemName={ServiceFormItemNames.YOUTUBE_CHANNEL_RADIO_GROUP}
      />

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

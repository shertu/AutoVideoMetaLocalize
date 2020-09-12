import { Button, Form, Row, Col, Collapse, Checkbox, Space } from 'antd';
import * as React from 'react';
import { Channel } from '../../../../generated-sources/openapi';
import { AuthorizedContent } from '../../AuthorizedContent/AuthorizedContent';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';
import EventStates from '../../../event-states';
import { FormProps } from 'antd/lib/form';


const FORM_ITEM_NAMES = {
  LANGUAGE_SELECTION: 'language-selection',
  VIDEO_SELECTION: 'video-selection',
  SMB_CHECKBOX: 'smb-checkbox',
  //CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceForm<Values = any>(props: FormProps<Values>): JSX.Element {
  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(undefined);

  const [mineYouTubeChannelTotalCount, setMineYouTubeChannelTotalCount] =
    React.useState<number>(undefined);

  const [form] = Form.useForm();

  /** Clears the form's fields and the language cookie. */
  function onClickClear() {
    form.setFieldsValue({
      [FORM_ITEM_NAMES.LANGUAGE_SELECTION]: [],
      [FORM_ITEM_NAMES.VIDEO_SELECTION]: [],
      [FORM_ITEM_NAMES.SMB_CHECKBOX]: false,
    });

    serializeLanguagesCookie();
  }

  /**
   * Stores the current value of the languages form item into a cookie.
   */
  function serializeLanguagesCookie() {
    const LANGUAGE_SELECTION: string[] = form.getFieldValue(FORM_ITEM_NAMES.LANGUAGE_SELECTION) || [];
    document.cookie = cookie.serialize(FORM_ITEM_NAMES.LANGUAGE_SELECTION, LANGUAGE_SELECTION.join(','), {
      sameSite: 'lax',
    });
  }

  const languageSelectionCookieValue: string = cookie.parse(document.cookie)[FORM_ITEM_NAMES.LANGUAGE_SELECTION];
  const languageSelectionInitialValue: string[] = languageSelectionCookieValue ? languageSelectionCookieValue.split(',') : [];

  return (
    <AuthorizedContent>
      <Form {...props}
        form={form}
      >
        <Form.Item
          label="Languages"
          name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
          rules={[{ required: true, message: 'Please select at least one language.' }]}
          initialValue={languageSelectionInitialValue}
        >
          <LanguageSelect />
        </Form.Item>

        <YouTubeChannelRadioGroup
          value={selectedMineYouTubeChannel}
          onChangeChannel={setSelectedMineYouTubeChannel}
          setResponseTotal={setMineYouTubeChannelTotalCount}
        />

        <Collapse className="ant-form-item">
          <Collapse.Panel header="Additional Options" key="1">
            <Form.Item
              name={FORM_ITEM_NAMES.SMB_CHECKBOX}
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Sheet Music Boss</Checkbox>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>

        <Row justify="end">
          <Space>
            <Button onClick={() => onClickClear()}>Clear</Button>
            <Button type="primary" htmlType="submit" >Execute</Button>
          </Space>
        </Row>
      </Form>
    </AuthorizedContent>
  );
}

//<Form.Item
//  label="Videos"
//  name={FORM_ITEM_NAMES.VIDEO_SELECTION}
//  rules={[{ required: true, message: 'Please select at least one video.' }]}
//>
//  <YouTubeVideoSelectionTable
//    selectedMineYouTubeChannel={selectedMineYouTubeChannel}
//  />
//</Form.Item>

//disabled = { executionState === EventStates.continuitive}
//<Row className="ant-form-item" hidden={isExactlyOneMineYouTubeChannel}>
//  <Col offset={props.labelCol.span} span={props.wrapperCol.span}>
//    <YouTubeChannelRadioGroup
//      setSelectedMineYouTubeChannel={setSelectedMineYouTubeChannel}
//      setYouTubeChannelRadioGroupHidden={setIsExactlyOneMineYouTubeChannel}
//      value={selectedMineYouTubeChannel?.id}
//    />
//  </Col>
//</Row>
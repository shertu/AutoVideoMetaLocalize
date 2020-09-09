import { Button, Form, Row, Col, Collapse, Checkbox } from 'antd';
import * as React from 'react';
import { Channel } from '../../../generated-sources/openapi';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';


const FORM_ITEM_NAMES = {
  LANGUAGE_SELECTION: 'language-selection',
  VIDEO_SELECTION: 'video-selection',
  SMB_CHECKBOX: 'smb-checkbox',
  CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(null);

  //const [serviceFormInputs, setServiceFormInputs] =
  //  React.useState<AppVideoLocalizeRequest>(null);

  const INITIAL_VALUE_LANGUAGE_SELECTION: string[] = cookie.parse(document.cookie)[FORM_ITEM_NAMES.LANGUAGE_SELECTION]?.split(',');

  // When the channel options are set then set the selected channel to the first option

  return (
    <AuthorizedContent>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="Languages"
          name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
          rules={[{ required: true, message: 'Please select at least one language.' }]}
          initialValue={INITIAL_VALUE_LANGUAGE_SELECTION}
        >
          <LanguageSelect />
        </Form.Item>

        <Row className="ant-form-item" style={{display: 'none'}}>
          <Col offset={4} span={20}>
            <YouTubeChannelRadioGroup
              onChangeChannel={setSelectedMineYouTubeChannel}
              value={selectedMineYouTubeChannel?.id}
            />
          </Col>
        </Row>

        {selectedMineYouTubeChannel &&
          <Form.Item
            label="Videos"
            name={FORM_ITEM_NAMES.VIDEO_SELECTION}
            rules={[{ required: true, message: 'Please select at least one video.' }]}
          >
            <YouTubeVideoSelectionTable
              selectedMineYouTubeChannel={selectedMineYouTubeChannel}
            />
          </Form.Item>
        }

        <Collapse className="ant-form-item">
          <Collapse.Panel header="Advanced Options" key="1">
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
          <Button type="primary" htmlType="submit">Execute</Button>
        </Row>
      </Form>

      <div>

      </div>
    </AuthorizedContent>
  );
}

//<Form.Item
//  label="Channel"
//  name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
//>
//  <YouTubeChannelRadioGroup
//    onChangeChannel={setSelectedMineYouTubeChannel}
//    value={selectedMineYouTubeChannel?.id}
//  />
//</Form.Item>
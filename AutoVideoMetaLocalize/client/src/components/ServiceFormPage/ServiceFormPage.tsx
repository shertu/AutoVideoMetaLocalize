import { Button, Result, Skeleton, message, Form, Row, Alert, Space } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppVideoLocalizeRequest } from '../../../generated-sources/openapi/models/AppVideoLocalizeRequest';
import routes from '../../routes';
import UserContext from '../UserContext/UserContext';
import { Channel, GetClaimsPrincipleResult, SupportedLanguage, I18nLanguageSnippet, LanguageApi } from '../../../generated-sources/openapi';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { RadioChangeEvent } from 'antd/lib/radio';

const LANGUAGE_API: LanguageApi = new LanguageApi();

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
        <Row>
          <Space direction="vertical">
            <Form.Item
              label="Languages"
              name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
              rules={[{ required: true, message: 'Please select at least one language.' }]}
              initialValue={INITIAL_VALUE_LANGUAGE_SELECTION}
            >
              <LanguageSelect />
            </Form.Item>
          </Space>
        </Row>

        <Row>
          <Row>
            <YouTubeChannelRadioGroup
              onChangeChannel={setSelectedMineYouTubeChannel}
              value={selectedMineYouTubeChannel?.id}
            />
          </Row>

          <div>
            {selectedMineYouTubeChannel?.id}
          </div>

          {selectedMineYouTubeChannel &&
            <Row>
              <Form.Item
                label="Videos"
                name={FORM_ITEM_NAMES.VIDEO_SELECTION}
                rules={[{ required: true, message: 'Please select at least one video.' }]}
              >
                <input />
              </Form.Item>
            </Row>
          }
        </Row>

        <Row justify="end">
          <Button type="primary" htmlType="submit">Execute</Button>
        </Row>
      </Form>

      <div>

      </div>
    </AuthorizedContent>
  );
}
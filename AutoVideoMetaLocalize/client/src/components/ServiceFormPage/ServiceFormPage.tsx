import { Button, Form, Row, Col, Collapse, Checkbox } from 'antd';
import * as React from 'react';
import { Channel, AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import * as cookie from 'cookie';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';
import { Page } from '../Page/Page';
import { Store } from 'antd/lib/form/interface';
import { ServiceFormExecutionPage } from './ServiceFormExecutionPage/ServiceFormExecutionPage';
import EventStates from '../../event-states';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

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

  const [executionState, setExecutionState] =
    React.useState<EventStates>(EventStates.prospective);

  const [executionError, setExecutionError] =
    React.useState<boolean>(false);

  const [executionProgressMax, setExecutionProgressMax] =
    React.useState<number>(0);

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: Store) {
    const LANGUAGE_SELECTION: string[] = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION];
    const VIDEO_SELECTION: string[] = values[FORM_ITEM_NAMES.VIDEO_SELECTION];
    const SMB_CHECKBOX: boolean = values[FORM_ITEM_NAMES.SMB_CHECKBOX];

    const serviceFormInputs: AppVideoLocalizeRequest = {
      languages: LANGUAGE_SELECTION,
      videos: VIDEO_SELECTION,
      sheetMusicBoss: SMB_CHECKBOX,
    }

    console.log("Service form inputs: ", serviceFormInputs);
    executeService(serviceFormInputs);
  }

  function executeService(serviceFormInputs: AppVideoLocalizeRequest) {
    if (executionState == EventStates.prospective || executionState == EventStates.retropective) {
      setExecutionState(EventStates.continuitive);
      setExecutionError(false);
      setExecutionProgressMax(serviceFormInputs.videos.length * serviceFormInputs.languages.length);

      document.cookie = cookie.serialize(FORM_ITEM_NAMES.LANGUAGE_SELECTION, serviceFormInputs.languages.join(','), {
        sameSite: 'lax',
      });

      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
        appVideoLocalizeRequest: serviceFormInputs,
      }).then(() => {
        setExecutionState(EventStates.retropective);
        setExecutionError(false);
      }).catch(() => {
        setExecutionState(EventStates.retropective);
        setExecutionError(true);
      });
    }
  }

  const INITIAL_VALUE_LANGUAGE_SELECTION: string[] = cookie.parse(document.cookie)[FORM_ITEM_NAMES.LANGUAGE_SELECTION]?.split(',');

  // When the channel options are set then set the selected channel to the first option

  return (
    <AuthorizedContent>
      <Page title="Service">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Languages"
            name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
            rules={[{ required: true, message: 'Please select at least one language.' }]}
            initialValue={INITIAL_VALUE_LANGUAGE_SELECTION}
          >
            <LanguageSelect />
          </Form.Item>

          <Row className="ant-form-item">
            <Col offset={4} span={20}>
              <YouTubeChannelRadioGroup
                onChangeChannel={setSelectedMineYouTubeChannel}
                value={selectedMineYouTubeChannel?.id}
                style={{ display: 'none' }}
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
            <Button type="primary" htmlType="submit" disabled={executionState === EventStates.continuitive}>Execute</Button>
          </Row>
        </Form>

        {executionState === EventStates.continuitive || executionState === EventStates.retropective &&
          <ServiceFormExecutionPage
            error={executionError}
            executionProgressMax={executionProgressMax}
            executionState={executionState}
          />
        }
      </Page>
    </AuthorizedContent>
  );
}

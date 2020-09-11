import { Button, Form, Row, Col, Collapse, Checkbox, Space, Carousel } from 'antd';
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
import { CSSTransition } from 'react-transition-group';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

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

  const [youTubeChannelRadioGroupHidden, setYouTubeChannelRadioGroupHidden] =
    React.useState<boolean>(false);

  const [executionState, setExecutionState] =
    React.useState<EventStates>(EventStates.prospective);

  const [executionError, setExecutionError] =
    React.useState<boolean>(false);

  const [executionProgressMax, setExecutionProgressMax] =
    React.useState<number>(0);

  const [inProp, setInProp] =
    React.useState<boolean>(false);

  const [form] = Form.useForm();
  const carouselRef = React.useRef<Carousel>();

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: Store) {
    const LANGUAGE_SELECTION: string[] = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION] || [];
    const VIDEO_SELECTION: string[] = values[FORM_ITEM_NAMES.VIDEO_SELECTION] || [];
    const SMB_CHECKBOX: boolean = values[FORM_ITEM_NAMES.SMB_CHECKBOX] || false;

    const serviceFormInputs: AppVideoLocalizeRequest = {
      languages: LANGUAGE_SELECTION,
      videos: VIDEO_SELECTION,
      sheetMusicBoss: SMB_CHECKBOX,
    }

    console.log("Service form inputs: ", serviceFormInputs);
    executeService(serviceFormInputs);
  }

  /**
   * 
   * @param serviceFormInputs
   */
  function executeService(serviceFormInputs: AppVideoLocalizeRequest) {
    if (executionState == EventStates.prospective || executionState == EventStates.retropective) {
      setExecutionState(EventStates.continuitive);
      setExecutionError(false);
      setExecutionProgressMax(serviceFormInputs.videos.length * serviceFormInputs.languages.length);

      serializeLanguagesCookie();

      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
        appVideoLocalizeRequest: serviceFormInputs,
      }).then(() => {
        setExecutionState(EventStates.retropective);
      }).catch(() => {
        setExecutionState(EventStates.retropective);
        setExecutionError(true);
      });
    }
  }

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

  const showExecutionPage: boolean = executionState === EventStates.continuitive || executionState === EventStates.retropective;

  React.useEffect(() => {
    if (carouselRef && carouselRef.current) {
      // this 'ref' has access to 'goTo', 'prev' and 'next'
      const carouselTarget: number = showExecutionPage ? 1 : 0;
      carouselRef.current.goTo(carouselTarget);
    }
  }, [executionState]);

  return (
    <AuthorizedContent>
      <Carousel ref={carouselRef} dots={false}>
        <Page title="Service">
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
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

            <Row className="ant-form-item" hidden={youTubeChannelRadioGroupHidden}>
              <Col offset={4} span={20}>
                <YouTubeChannelRadioGroup
                  setSelectedMineYouTubeChannel={setSelectedMineYouTubeChannel}
                  setYouTubeChannelRadioGroupHidden={setYouTubeChannelRadioGroupHidden}
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
                <Button type="primary" htmlType="submit" disabled={executionState === EventStates.continuitive}>Execute</Button>
              </Space>
            </Row>
          </Form>
        </Page>

        <ServiceFormExecutionPage
          error={executionError}
          executionProgressMax={executionProgressMax}
          executionState={executionState}
        />
      </Carousel>
    </AuthorizedContent>
  );
}

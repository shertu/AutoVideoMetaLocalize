import * as React from 'react';
import './style.less';
import { Store } from 'antd/lib/form/interface';
import { LanguageApi, YouTubePlaylistItemApi, Channel, AppSupportedLanguage, PlaylistItemListResponse, ApiYouTubeVideoTranslatePostRequest } from '../../../../../generated-sources/openapi';
import { Select, Divider, Form, Row, Col, Button } from 'antd';
import { Page } from '../../Page';
import { VideoSelectionTable } from './VideoSelectionTable/VideoSelectionTable';
import { LeftOutlined } from '@ant-design/icons';

const LANGUAGE_API = new LanguageApi();
const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

const FORM_ITEM_NAMES = {
  LANGUAGE_SELECTION: 'language-selection',
  VIDEO_SELECTION: 'video-selection',
};

/**
 * The content for the step where the user is selecting options for the AVML process.
 *
 * @param {object} props
 * @param {Function} props.onFinish The event called when the user finishes input.
 * @param {Function} props.onBack The event called when the user clicks the back button.
 * @param {Channel} props.channel The channel used to enumerate through the videos.
 * @return {JSX.Element}
 */
export function ConfigurationStepContent(props: {
  channel: Channel,
  setVideoTranslateRequestState: React.Dispatch<React.SetStateAction<ApiYouTubeVideoTranslatePostRequest>>,
  onContinue?: () => void,
  onBack?: () => void,
}): JSX.Element {
  const channel: Channel = props.channel;

  const [languages, setLanguages] =
    React.useState<AppSupportedLanguage[]>(null);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setLanguages(res));
  }, []);

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  async function onFinish(values: Store): Promise<void> {
    const selectedLanguages: any = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION];
    console.log(selectedLanguages);
  }

  return (
    <Page id="translate-channel-page">
      <Divider>Options</Divider>

      {channel && (
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Languages"
            name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
            rules={[{ required: true, message: 'Please select at least one language.' }]}
          >
            <Select
              loading={languages == null}
              mode="multiple"
            >
              {languages && languages.map((_, i) =>
                <Select.Option key={_.code} value={_.code}>
                  {_.name}
                </Select.Option >,
              )}
            </Select>
          </Form.Item>


          <Form.Item
            label="Videos"
            name={FORM_ITEM_NAMES.VIDEO_SELECTION}
            rules={[{ required: true, message: 'Please select at least one video.' }]}
          >
            <VideoSelectionTable />
          </Form.Item>

          <Row align="middle" justify="space-between" gutter={8}>
            <Col>
              <Button shape="circle" icon={<LeftOutlined />} onClick={props.onBack} style={{ width: 49 }} />
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">Continue</Button>
            </Col>
          </Row>
        </Form>
      )}
    </Page>
  );
}

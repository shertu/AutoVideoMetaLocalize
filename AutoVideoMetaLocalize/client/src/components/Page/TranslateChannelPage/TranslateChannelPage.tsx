import * as React from 'react';
import './style.less';
import {Page} from '../Page';
import {Channel, AppSupportedLanguage, LanguageApi } from '../../../../generated-sources/openapi';
import {PageHeader, Form, Select, DatePicker, Button, Row} from 'antd';
import {Store} from 'antd/lib/form/interface';
import { TranslateProgress } from './TranslateProgress/TranslateProgress';
import { YouTubeVideoApi } from '../../../../generated-sources/openapi/apis/YouTubeVideoApi';
import { YouTubePlaylistItemApi } from '../../../../generated-sources/openapi/apis/YouTubePlaylistItemApi';
import { PlaylistItem } from '../../../../generated-sources/openapi/models/PlaylistItem';

const LANGUAGE_API = new LanguageApi();
const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();
const YOUTUBE_VIDEO_API = new YouTubeVideoApi();

const {Option} = Select;

const FORM_ITEM_NAMES = {
  PUBLISH_DATE_RANGE: 'publish-date-range',
  LANGUAGE_SELECTION: 'language-selection',
};

/**
 * A page which contains options and progress information for the AVML process.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function TranslateChannelPage(props: {
  channel: Channel,
  onBack?: (e: React.MouseEvent<HTMLDivElement>) => void,
}): JSX.Element {
  if (!props.channel || !props.channel.id || !props.channel.contentDetails) {
    throw new Error('The channel prop is invalid.');
  }

  const [languages, setLanguages] =
    React.useState<AppSupportedLanguage[]>(null);

  const [playlistItem, setPlaylistItem] =
    React.useState<PlaylistItem[]>(null);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setLanguages(res));

    YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemVideosInPlaylistGet({
      playlistId: props.channel.contentDetails.relatedPlaylists.uploads,
      pageToken: null,
    }).then((res) => setPlaylistItem(res));
  }, []);

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  async function onFinish(values: Store): Promise<void> {
    console.log(values);

    const selectedLanguages: any = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION];
    console.log(selectedLanguages);

    //TRANSLATE_CHANNEL_API.apiTranslateChannelTranslateChannelPost({
    //  channelId: props.channel.id,
    //  languages: selectedLanguages,
    //});
  }

  const LANGUAGE_SELECTION_MESSAGE: string = 'please select at least one language';

  return (
    <Page id="translate-channel-page">
      <PageHeader
        className="site-page-header"
        title="Options"
        onBack={props.onBack}
      />

      <Form
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        onFinish={onFinish}
      >
        <Form.Item
          label="Languages"
          name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
          rules={[{required: true, message: LANGUAGE_SELECTION_MESSAGE}]}
        >
          <Select
            loading={languages == null}
            mode="multiple"
            placeholder={LANGUAGE_SELECTION_MESSAGE}
          >
            {languages && languages.map((_, i) =>
              <Option key={_.code} value={_.code}>
                {_.name}
              </Option >,
            )}
          </Select>
        </Form.Item>

        <Row align="middle" justify="end">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Row>
      </Form>

      <TranslateProgress continuitive={false} />
    </Page>
  );
}

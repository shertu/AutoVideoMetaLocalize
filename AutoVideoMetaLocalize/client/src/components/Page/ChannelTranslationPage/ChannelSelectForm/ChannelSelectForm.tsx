import {Button, Col, Divider, Form, Radio, Row} from 'antd';
import {Store} from 'antd/lib/form/interface';
import * as React from 'react';
import {Channel, ChannelListResponse, YouTubeChannelApi, ApiYouTubeChannelListGetRequest} from '../../../../../generated-sources/openapi';
import {BasicComboView} from '../../../BasicComboView/BasicComboView';
import {Page} from '../../Page';
import './style.less';

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();

const FORM_ITEM_NAMES = {
  CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The channel selection screen and content.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ChannelSelectForm(props: {
  onFinish: (channel: Channel) => void
}): JSX.Element {
  const [options, setOptions] =
    React.useState<Channel[]>(null);

  React.useEffect(() => {
    fetchOptionsAsync()
        .then((res) => setOptions(res));
  }, []);

  const DEFAULT_OPTION: string = (options && options.length) ? options[0].id : null;

  /**
   * Fetches every YouTube channel from the user's Google account.
   */
  async function fetchOptionsAsync(): Promise<Channel[]> {
    let items: Channel[] = [];
    const req: ApiYouTubeChannelListGetRequest = {
      part: 'id,snippet,contentDetails',
      mine: true,
    };

    do {
      const response: ChannelListResponse = await YOUTUBE_CHANNEL_API.apiYouTubeChannelListGet(req);
      req.pageToken = response.nextPageToken;
      items = items.concat(response.items);
    } while (req.pageToken);

    return items;
  }

  /**
   * Called when the channel selection form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  async function onFinish(values: Store): Promise<void> {
    const CHANNEL_RADIO_GROUP_VALUE = values[FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP];
    const selected: Channel = options.find((elem) => elem.id == CHANNEL_RADIO_GROUP_VALUE);
    props.onFinish(selected);
  }

  return (
    <Page>
      <Divider>Channel Selection</Divider>

      {options && (
        <Form
          onFinish={onFinish}
          initialValues={{
            [FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP]: DEFAULT_OPTION,
          }}
        >
          <Row align="top" justify="center">
            <Form.Item
              className="max-cell-sm"
              name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
              rules={[{ required: true, message: 'Please select a channel.' }]}
            >
              <Radio.Group className="max-cell-sm">
                {options && options.map((_) =>
                  <Radio.Button className="max-cell-sm" key={_.id} value={_.id} >
                    <BasicComboView
                      thumbnail={_.snippet.thumbnails._default}
                      title={_.snippet.title}
                      subtitle={_.id}
                    />
                  </Radio.Button>,
                )}
              </Radio.Group>
            </Form.Item>
          </Row>

          <Row align="middle" justify="end" gutter={8}>
            <Col>
              <Button type="primary" htmlType="submit">Continue</Button>
            </Col>
          </Row>
        </Form>
      )}
    </Page>
  );
}

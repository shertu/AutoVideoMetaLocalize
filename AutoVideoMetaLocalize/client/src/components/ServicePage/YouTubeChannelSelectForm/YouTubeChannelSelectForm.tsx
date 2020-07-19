import { Button, Col, Form, Radio, Row, Alert } from 'antd';
import { Store } from 'antd/lib/form/interface';
import * as React from 'react';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../generated-sources/openapi';
import { BasicComboView } from '../../BasicComboView/BasicComboView';
import { Page } from '../../Page/Page';
import './style.less';
import { GoogleUnauthorizedResult } from '../GoogleUnauthorizedResult/GoogleUnauthorizedResult';

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
export function YouTubeChannelSelectForm(props: {
  onFinishSelection?: (channel: Channel) => void,
}): JSX.Element {
  const { onFinishSelection } = props;

  const [options, setOptions] =
    React.useState<Channel[]>(null);

  const [googleFetchError, setGoogleFetchError] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    fetchMineYouTubeChannelList()
      .then((res) => setOptions(res))
      .catch((err) => setGoogleFetchError(true));
  }, []);

  /** Fetches every YouTube channel from the user's Google account. */
  async function fetchMineYouTubeChannelList(): Promise<Channel[]> {
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
  function onFinish(values: Store) {
    const CHANNEL_RADIO_GROUP_VALUE = values[FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP];
    const selectedChannel: Channel = options.find((elem) => elem.id == CHANNEL_RADIO_GROUP_VALUE);

    if (onFinishSelection) {
      onFinishSelection(selectedChannel);
    }
  }

  if (options == null) { // The fetch operation is still in progress.
    return null;
  }

  if (googleFetchError) { // An error occured while attempting to fetch the user's YouTube information.
    return <GoogleUnauthorizedResult />;
  }

  const DEFAULT_OPTION: string = (options && options.length) ? options[0].id : null;

  return (
    <Page title="YouTube Channel Selection">
      {(options.length) ? (
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
                {options.map((_) =>
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
      ) : <Alert message="No YouTube channels exist for this Google account." type="warning" />
      }
    </Page>
  );
}

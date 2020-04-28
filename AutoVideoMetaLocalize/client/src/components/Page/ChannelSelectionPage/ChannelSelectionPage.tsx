import { Radio, Row, Form, Card, Button, Typography, Divider, Col } from 'antd';
import * as React from 'react';
import { Channel, YouTubeApi } from '../../../../generated-sources/openapi';
import { GoogleSignInButton } from '../../GoogleSignInButton/GoogleSignInButton';
import UserContext from '../../UserContext/UserContext';
import { Page } from '../Page';
import './style.less';
import { ChannelCard } from '../../ChannelCard/ChannelCard';
import { GoogleSignOutButton } from '../../GoogleSignOutButton/GoogleSignOutButton';
import { Store } from 'antd/lib/form/interface';

const { Title, Paragraph, Text } = Typography;

const YOUTUBE_API: YouTubeApi = new YouTubeApi();

const GOOGLE_AUTH_SCOPES: string[] = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/cloud-translation",
];

const FORM_ITEM_NAMES = {
  CHANNEL_RADIO_GROUP: 'channel-selection'
}

/**
 * The page used to sign-in to google and select a YouTube channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ChannelSelectionPage(props: {
  setSelectedChannel: React.Dispatch<React.SetStateAction<Channel>>
}): JSX.Element {
  const user = React.useContext(UserContext);

  const [channelOptions, setChannelOptions] =
    React.useState<Array<Channel>>(null);

  React.useEffect(() => {
    if (user) {
      YOUTUBE_API.apiYouTubeGetMyChannelsGet()
        .then((res) => setChannelOptions(res))
        .catch(err => console.log(err));
    }
  }, []);

  const CHANNEL_RADIO_GROUP_DEFAULT = (channelOptions && channelOptions.length > 0) ? channelOptions[0].id : null;

  async function onFinish(values: Store): Promise<void> {
    console.log(values);

    const CHANNEL_RADIO_GROUP_VALUE = values[FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP];

    console.log(CHANNEL_RADIO_GROUP_VALUE);
  }

  return (
    <Page id="channel-selection">
      <Divider>
        Channel Selection
      </Divider>

      <Row align="middle" justify="center">
        <Paragraph className="max-cell-xs">
          To use this service please sign-in to your YouTube account.
        </Paragraph>
      </Row>

      {user ? (
        <Form onFinish={onFinish}>
          {channelOptions && (
            <Form.Item
              name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
              rules={[{ required: true, message: 'please select a channel' }]}
            >
              <Radio.Group defaultValue={CHANNEL_RADIO_GROUP_DEFAULT}>
                {channelOptions.map((_, i) => {
                  <Radio.Button value={_.id}>
                    <ChannelCard channel={_} />
                  </Radio.Button>
                })}
              </Radio.Group>
            </Form.Item>
          )}
          <Row align="middle" justify="end" gutter={8}>
            <GoogleSignOutButton />
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          </Row>
        </Form>
      ) : (
          <Row align="middle" justify="center">
            <GoogleSignInButton scopes={GOOGLE_AUTH_SCOPES} />
          </Row>
        )}
    </Page>
  );
}

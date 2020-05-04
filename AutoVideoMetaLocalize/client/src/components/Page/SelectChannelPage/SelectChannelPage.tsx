import { Radio, Row, Form, Button, Typography, Divider, Col } from 'antd';
import * as React from 'react';
import { Channel } from '../../../../generated-sources/openapi';
import { GoogleSignInButton } from '../../GoogleSignInButton/GoogleSignInButton';
import UserContext from '../../UserContext/UserContext';
import { Page } from '../Page';
import './style.less';
import { ChannelCard } from '../../ChannelCard/ChannelCard';
import { GoogleSignOutButton } from '../../GoogleSignOutButton/GoogleSignOutButton';
import { Store } from 'antd/lib/form/interface';
import { YouTubeChannelApi } from '../../../../generated-sources/openapi/apis/YouTubeChannelApi';

const { Paragraph } = Typography;

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();

const GOOGLE_AUTH_SCOPES: string[] = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/cloud-translation',
];

const FORM_ITEM_NAMES = {
  CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The page used to sign-in to google and select a YouTube channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function SelectChannelPage(props: {
  setSelectedChannel: React.Dispatch<React.SetStateAction<Channel>>
}): JSX.Element {
  const user = React.useContext(UserContext);

  const [channelOptions, setChannelOptions] =
    React.useState<Array<Channel>>(null);

  React.useEffect(() => {
    if (user) {
      YOUTUBE_CHANNEL_API.apiYouTubeChannelMineGet()
        .then((res) => setChannelOptions(res))
        .catch((err) => console.log(err));
    }
  }, [user]);

  const CHANNEL_RADIO_GROUP_DEFAULT = (channelOptions && channelOptions.length > 0) ? channelOptions[0].id : null;

  /**
   * Called when the channel selection form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  async function onFinish(values: Store): Promise<void> {
    const CHANNEL_RADIO_GROUP_VALUE = values[FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP];
    const selected: Channel = channelOptions.find(elem => elem.id == CHANNEL_RADIO_GROUP_VALUE);
    props.setSelectedChannel(selected);
  }

  let channelRadioGroupOptions: JSX.Element[] = null;
  if (channelOptions) {
    channelRadioGroupOptions = channelOptions.map((_, i) =>
      <Radio.Button key={_.id} value={_.id}>
        <ChannelCard channel={_} />
      </Radio.Button>
    );
  }

  return (
    <Page id="SelectChannelPage">
      <Divider>
        Channel Selection
      </Divider>

      <Row align="middle" justify="center">
        <Paragraph className="max-cell-xs">
          To use this service please sign-in to YouTube.
        </Paragraph>
      </Row>

      {user ? (
        <Form onFinish={onFinish} initialValues={{
          [FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP]: CHANNEL_RADIO_GROUP_DEFAULT
        }}>
          <Form.Item
            name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
            rules={[{ required: true, message: 'please select a channel' }]}
          >
            <Row align="top" justify="center">
              <Radio.Group className="channel-radio-group">
                {channelRadioGroupOptions}
              </Radio.Group>
            </Row>
          </Form.Item>

          <Row className="select-channel-button-group" align="middle" justify="end" gutter={8}>
            <Col>
              <GoogleSignOutButton />
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Continue
              </Button>
            </Col>
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

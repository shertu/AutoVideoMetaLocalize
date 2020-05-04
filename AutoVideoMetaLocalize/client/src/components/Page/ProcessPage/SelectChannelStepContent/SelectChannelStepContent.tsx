import {Radio, Row, Form, Button, Typography, Divider, Col} from 'antd';
import * as React from 'react';
import './style.less';
import {Store} from 'antd/lib/form/interface';
import {Page} from '../../Page';
import {Channel, YouTubeChannelApi} from '../../../../../generated-sources/openapi';
import {ChannelCard} from '../../../ChannelCard/ChannelCard';

const {Paragraph} = Typography;

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();

const FORM_ITEM_NAMES = {
  CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The content for the step where the user is selecting a channel.
 *
 * @param {object} props
 * @param {Function} props.onFinish The event called when the user finishes input.
 * @return {JSX.Element}
 */
export function SelectChannelStepContent(props: {
  onFinish: (channel: Channel) => void
}): JSX.Element {
  const [options, setOptions] =
    React.useState<Array<Channel>>(null);

  React.useEffect(() => {
    YOUTUBE_CHANNEL_API.apiYouTubeChannelMineGet()
        .then((res) => setOptions(res))
        .catch((err) => console.log(err));
  }, []);

  const CHANNEL_RADIO_GROUP_DEFAULT = (options && options.length > 0) ? options[0].id : null;

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

  const SELECTION_MESSAGE: string = 'Please select a channel.';

  return (
    <Page id="SelectChannelPage">
      <Divider>Channel Selection</Divider>

      {options && (
        <Form onFinish={onFinish} initialValues={{
          [FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP]: CHANNEL_RADIO_GROUP_DEFAULT,
        }}>
          <Row align="top" justify="center">
            <Form.Item
              className="max-cell-md"
              name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
              rules={[{required: true, message: SELECTION_MESSAGE}]}
            >
              <Radio.Group style={{marginBottom: '1em'}}>
                {options.map((_) =>
                  <Radio.Button key={_.id} value={_.id} style={{padding: 0}}>
                    <ChannelCard channel={_} />
                  </Radio.Button>,
                )}
              </Radio.Group>
            </Form.Item>
          </Row>

          <Form.Item>
            <Row align="middle" justify="end" gutter={8}>
              <Col>
                <Button type="primary" htmlType="submit">Continue</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      )}
    </Page >
  );
}

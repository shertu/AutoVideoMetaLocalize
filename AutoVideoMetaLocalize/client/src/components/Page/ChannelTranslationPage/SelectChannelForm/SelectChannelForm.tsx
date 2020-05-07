import {Button, Col, Form, Radio, Row} from 'antd';
import {Store} from 'antd/lib/form/interface';
import * as React from 'react';
import {Channel, YouTubeChannelApi} from '../../../../../generated-sources/openapi';
import {BasicComboView} from '../../../BasicComboView/BasicComboView';
import StepsStateContext from '../StepsStateContext/StepsStateContext';
import './style.less';

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();

const FORM_ITEM_NAMES = {
  CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The content for the step where the user is selecting a channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function SelectChannelForm(props: {
  setChannelStateAction: React.Dispatch<React.SetStateAction<Channel>>,
}): JSX.Element {
  const stepsState = React.useContext(StepsStateContext);

  const [options, setOptions] =
    React.useState<Channel[]>(null);

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
    props.setChannelStateAction(selected);
    stepsState.setValue(stepsState.value + 1);
  }

  // do not initialize the form until the options state is set
  if (!options) {
    return null;
  }

  return (
    <Form onFinish={onFinish} initialValues={{
      [FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP]: CHANNEL_RADIO_GROUP_DEFAULT,
    }}>
      <Row align="top" justify="center">
        <Form.Item
          className="max-cell-md"
          name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
          rules={[{required: true, message: 'Please select a channel.'}]}
        >
          <Radio.Group className="max-cell-md">
            {options && options.map((_) =>
              <Radio.Button className="max-cell-md" key={_.id} value={_.id}>
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
  );
}

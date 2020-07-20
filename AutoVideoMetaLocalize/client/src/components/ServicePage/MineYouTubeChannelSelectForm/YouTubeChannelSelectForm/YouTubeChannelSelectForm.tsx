import { Button, Col, Form, Radio, Row } from 'antd';
import { Store } from 'antd/lib/form/interface';
import * as React from 'react';
import { Channel } from '../../../../../generated-sources/openapi';
import { BasicComboView } from '../../../BasicComboView/BasicComboView';
import './style.less';

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
  options?: Channel[],
  onFinishSelection?: (channel: Channel) => void,
}): JSX.Element {
  const options = props.options || [];
  const { onFinishSelection } = props;

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

  const DEFAULT_OPTION: string = (options && options.length) ? options[0].id : null;

//  initialValues = {{
//    [FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP]: DEFAULT_OPTION,
//      }
//}




  //name = { FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP }

  //{
  //  options.map((x) => x && x.id &&
  //    <Radio.Button className="max-cell-sm" key={x.id} value={x.id} >
  //      <BasicComboView
  //        thumbnail={x.snippet?.thumbnails._default}
  //        title={x.snippet?.title}
  //        subtitle={x.id}
  //      />
  //    </Radio.Button>,
  //  )
  //}

  return (
    <Form
      onFinish={onFinish}
    >
      <Row align="top" justify="center">
        <Form.Item
          className="max-cell-sm"
          id={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
          name={FORM_ITEM_NAMES.CHANNEL_RADIO_GROUP}
          rules={[{ required: true, message: 'Please select a channel.' }]}
        >
          <Radio.Group className="max-cell-sm">
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

import { Form } from 'antd';
import * as React from 'react';
import { Channel } from '../../../../../generated-sources/openapi';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';
import { FormItemProps } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function YouTubeCombo(props: {
  YouTubeChannelRadioGroupFormItemName?: NamePath;
  YouTubeVideoSelectionTableFormItemName?: NamePath;
}): JSX.Element {
  const { YouTubeChannelRadioGroupFormItemName, YouTubeVideoSelectionTableFormItemName } = props;

  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(undefined);

  const [mineYouTubeChannelTotalCount, setMineYouTubeChannelTotalCount] =
    React.useState<number>(undefined);

  return (
    <>
      <Form.Item
        label="Channel"
        name={YouTubeChannelRadioGroupFormItemName}
        rules={[{ required: false, message: 'Please select at least one channel.' }]}
      >
        <YouTubeChannelRadioGroup
          onChangeChannel={setSelectedMineYouTubeChannel}
          setResponseTotal={setMineYouTubeChannelTotalCount}
          className="max-cell-sm"
        />
      </Form.Item>

      <Form.Item
        label="Videos"
        name={YouTubeVideoSelectionTableFormItemName}
        rules={[{ required: true, message: 'Please select at least one video.' }]}
      >
        <YouTubeVideoSelectionTable
          selectedMineYouTubeChannel={selectedMineYouTubeChannel}
        />
      </Form.Item>
    </>
  );
}





//hidden = { mineYouTubeChannelTotalCount === 1}

import { Form, Row, Space } from 'antd';
import * as React from 'react';
import { Channel, ChannelListResponse } from '../../../../../generated-sources/openapi';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { RadioChangeEvent } from 'antd/lib/radio';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function YouTubeCombo(props: {
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
}): JSX.Element {
  const { value, onChange } = props;

  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(undefined);

  const [channelPageTotal, setChannelPageTotal] =
    React.useState<number>(undefined);

  function onChangeYouTubeChannelRadioGroupResponse(response: ChannelListResponse) {
    setChannelPageTotal(response?.pageInfo.totalResults);
  }

  return (
    <Space direction="vertical" className="max-cell">
      <div>
        <YouTubeChannelRadioGroup
          onChangeChannel={setSelectedMineYouTubeChannel}
          onChangeResponse={onChangeYouTubeChannelRadioGroupResponse}
          className="max-cell-sm"
        />
      </div>

      <YouTubeVideoSelectionTable
        youtubeChannel={selectedMineYouTubeChannel}
        onChange={onChange}
        value={value}
        className="max-cell-sm"
      />
    </Space>
  );
}





//hidden = { mineYouTubeChannelTotalCount === 1}

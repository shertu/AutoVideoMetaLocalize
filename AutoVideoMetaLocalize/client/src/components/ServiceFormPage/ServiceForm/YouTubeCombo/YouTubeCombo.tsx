import * as React from 'react';
import { Channel, ChannelListResponse } from '../../../../../generated-sources/openapi';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeChannelVideoUploadsSelectionTable } from './YouTubeChannelVideoUploadsSelectionTable/YouTubeChannelVideoUploadsSelectionTable';
import { Row } from 'antd';

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

  const [mineYouTubeChannelCountTotal, setMineYouTubeChannelCountTotal] =
    React.useState<number>(undefined);

  function onChangeYouTubeChannelRadioGroupResponse(response: ChannelListResponse) {
    setMineYouTubeChannelCountTotal(response?.pageInfo.totalResults);
  }

  console.log(selectedMineYouTubeChannel, mineYouTubeChannelCountTotal);

  return (
    <>
      <div hidden={mineYouTubeChannelCountTotal === 1}>
        <YouTubeChannelRadioGroup
          onChangeChannel={setSelectedMineYouTubeChannel}
          onChangeResponse={onChangeYouTubeChannelRadioGroupResponse}
          className="max-cell-sm"
        />
      </div>

      {selectedMineYouTubeChannel &&
        <YouTubeChannelVideoUploadsSelectionTable
          channel={selectedMineYouTubeChannel}
          onChange={onChange}
          value={value}
          className="max-cell-sm"
        />
      }
    </>
  );
}

//hidden = { mineYouTubeChannelTotalCount === 1}

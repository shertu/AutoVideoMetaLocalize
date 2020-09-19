import * as React from 'react';
import {Channel, ChannelListResponse} from '../../../../../generated-sources/openapi';
import {YouTubeChannelRadioGroup} from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import {YouTubeChannelVideoUploadsSelectionTable} from './YouTubeChannelVideoUploadsSelectionTable/YouTubeChannelVideoUploadsSelectionTable';

/**
 * A react component used to select videos from a user's YouTube uploads.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function YouTubeCombo(props: {
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
}): JSX.Element {
  const {value, onChange} = props;

  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(undefined);

  const [mineYouTubeChannelCountTotal, setMineYouTubeChannelCountTotal] =
    React.useState<number>(undefined);

  /**
   * The event called the total number of paginated channels change.
   *
   * @param {ChannelListResponse} response
   */
  function onChangeYouTubeChannelRadioGroupResponse(response: ChannelListResponse) {
    setMineYouTubeChannelCountTotal(response?.pageInfo.totalResults);
  }

  return (
    <>
      <div hidden={mineYouTubeChannelCountTotal === 1}>
        <YouTubeChannelRadioGroup
          onChangeChannel={setSelectedMineYouTubeChannel}
          onChangeResponse={onChangeYouTubeChannelRadioGroupResponse}
        />
      </div>

      {selectedMineYouTubeChannel &&
        <YouTubeChannelVideoUploadsSelectionTable
          channel={selectedMineYouTubeChannel}
          onChange={onChange}
          value={value}
        />
      }
    </>
  );
}

// hidden = { mineYouTubeChannelTotalCount === 1}

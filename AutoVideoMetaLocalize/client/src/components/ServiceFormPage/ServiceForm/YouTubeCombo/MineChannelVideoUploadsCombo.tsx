import * as React from 'react';
import {Channel, ChannelListResponse} from '../../../../../generated-sources/openapi';
import {MineYouTubeChannelRadioGroup} from './MineYouTubeChannelRadioGroup/MineYouTubeChannelRadioGroup';
import {YouTubeChannelVideoUploadsSelectionTable} from './YouTubeChannelVideoUploadsSelectionTable/YouTubeChannelVideoUploadsSelectionTable';

/**
 * A combo component used to select a subset of videos from the user's YouTube uploads.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function MineChannelVideoUploadsCombo(props: {
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
}): JSX.Element {
  const {value, onChange} = props;

  /** The selected YouTube channel from the list of the channels associated with the user's Google account.  */
  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(undefined);

  /** The total number of YouTube channels associated with the user's Google account. */
  const [mineYouTubeChannelCountTotal, setMineYouTubeChannelCountTotal] =
    React.useState<number>(undefined);

  /**
   * The event called when the channel radio group's response changes.
   *
   * @param {ChannelListResponse} response
   */
  function onChangeYouTubeChannelRadioGroupResponse(response: ChannelListResponse) {
    setMineYouTubeChannelCountTotal(response?.pageInfo.totalResults);
  }

  return (
    <>
      <div hidden={mineYouTubeChannelCountTotal === 1}>
        <MineYouTubeChannelRadioGroup
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

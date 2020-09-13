import { Form } from 'antd';
import * as React from 'react';
import { Channel } from '../../../../../generated-sources/openapi';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';
import ServiceFormItemNames from '../../ServiceFormItemNames';


/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function YouTubeCombo(): JSX.Element {
  const [selectedMineYouTubeChannel, setSelectedMineYouTubeChannel] =
    React.useState<Channel>(undefined);

  const [mineYouTubeChannelTotalCount, setMineYouTubeChannelTotalCount] =
    React.useState<number>(undefined);

  return (
    <>
      <YouTubeChannelRadioGroup
        onChangeChannel={setSelectedMineYouTubeChannel}
        setResponseTotal={setMineYouTubeChannelTotalCount}
      />
    </>
  );
}

//<Form.Item
//  label="Channel"
//  name={ServiceFormItemNames.VIDEO_SELECTION}
//  rules={[{ required: false, message: 'Please select at least one channel.' }]}
//>
//  <YouTubeChannelRadioGroup
//    onChangeChannel={setSelectedMineYouTubeChannel}
//    setResponseTotal={setMineYouTubeChannelTotalCount}
//  />
//</Form.Item>

//<Form.Item
//  label="Videos"
//  name={ServiceFormItemNames.VIDEO_SELECTION}
//  rules={[{ required: true, message: 'Please select at least one video.' }]}
//>
//  <YouTubeVideoSelectionTable
//    selectedMineYouTubeChannel={selectedMineYouTubeChannel}
//  />
//</Form.Item>

//hidden = { mineYouTubeChannelTotalCount === 1}

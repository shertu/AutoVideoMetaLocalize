import { Form } from 'antd';
import * as React from 'react';
import { Channel } from '../../../../../generated-sources/openapi';
import { YouTubeChannelRadioGroup } from './YouTubeChannelRadioGroup/YouTubeChannelRadioGroup';
import { YouTubeVideoSelectionTable } from './YouTubeVideoSelectionTable/YouTubeVideoSelectionTable';
import { FormItemProps, FormInstance } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function YouTubeCombo(props: {
  form: FormInstance;
  youTubeChannelRadioGroupFormItemName?: NamePath;
  youTubeVideoSelectionTableFormItemName?: NamePath;
}): JSX.Element {
  const { form, youTubeChannelRadioGroupFormItemName, youTubeVideoSelectionTableFormItemName } = props;

  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>(undefined);

  const selectedChannelId: string = form.getFieldValue(youTubeChannelRadioGroupFormItemName);
  const selectedChannel: Channel = mineYouTubeChannels.find((channel: Channel) => channel.id == selectedChannelId);
  console.log(selectedChannel);

  //React.useEffect(() => {
  //  onChangePagination(1); // pagination starts at one
  //}, [mineYouTubeChannels]);

  return (
    <>
      <Form.Item
        label="Channel"
        name={youTubeChannelRadioGroupFormItemName}
        rules={[{ required: false, message: 'Please select at least one channel.' }]}
      >
        <YouTubeChannelRadioGroup
          mineYouTubeChannels={mineYouTubeChannels}
          setMineYouTubeChannels={setMineYouTubeChannels}
          className="max-cell-sm"
        />
      </Form.Item>
    </>
  );
}


//<Form.Item
//  label="Videos"
//  name={YouTubeVideoSelectionTableFormItemName}
//  rules={[{ required: true, message: 'Please select at least one video.' }]}
//>
//  <YouTubeVideoSelectionTable
//    selectedMineYouTubeChannel={selectedMineYouTubeChannel}
//  />
//</Form.Item>


//hidden = { mineYouTubeChannelTotalCount === 1}

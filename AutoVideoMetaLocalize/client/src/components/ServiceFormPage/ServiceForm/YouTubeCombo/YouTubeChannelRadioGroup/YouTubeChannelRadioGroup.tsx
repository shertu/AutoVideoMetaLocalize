import { Radio, Alert, Spin, Row } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../../../generated-sources/openapi';
import { RadioChangeEvent } from 'antd/lib/radio';
import InfiniteScroll from "react-infinite-scroll-component";

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();
const DEFAULT_PAGE_SIZE: number = 30;

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @return {JSX.Element}
 */
export function YouTubeChannelRadioGroup(props: {
  onChangeChannel?: (channel: Channel) => void;
  onChangeResponse?: (response: ChannelListResponse) => void;
  className?: string;
}): JSX.Element {
  const { onChangeChannel, onChangeResponse, className } = props;

  const [radioGroupValue, setRadioGroupValue] =
    React.useState<string>(undefined);

  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>([]);

  const [currentResponse, setCurrentResponse] =
    React.useState<ChannelListResponse>(undefined);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [error, setError] =
    React.useState<boolean>(false);

  // After the response is changed then append the items to the data set
  React.useEffect(() => {
    if (currentResponse) {
      let data: Channel[] = mineYouTubeChannels || []; // important to default data value
      data = data.concat(currentResponse.items);
      setMineYouTubeChannels(data);
    }
  }, [currentResponse]);

  // A valid channel option is to be selected when possible.
  React.useEffect(() => {
    const channel: Channel = findMineYouTubeChannel(radioGroupValue);

    if (channel == null && mineYouTubeChannels?.length > 0) {
      setRadioGroupValue(mineYouTubeChannels[0].id);
    }
  }, [mineYouTubeChannels]);

  //// Hook to extract selected channel
  //React.useEffect(() => {
  //  const channel: Channel = findMineYouTubeChannel(radioGroupValue);

  //  if (onChangeChannel) { onChangeChannel(channel); }
  //}, [radioGroupValue]);

  //// Hook to extract response page info
  //React.useEffect(() => {
  //  if (onChangeResponse) { onChangeResponse(currentResponse); }
  //}, [currentResponse]);

  /** The radio group's onChange event. */
  function onChange(e: RadioChangeEvent) {
    setRadioGroupValue(e.target.value);
  }

  /** Finds the specified channel by id from the radio group options. */
  function findMineYouTubeChannel(channelId: string): Channel {
    return mineYouTubeChannels?.find((channel: Channel) => channel.id == channelId);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   */
  function onChangePagination(page: number, pageSize?: number): void {
    //pageSize = pageSize || DEFAULT_PAGE_SIZE;
    //const newMaxDesiredContentLength = page * pageSize;

    console.log("onChangePagination", page, pageSize);

    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 500);

    // error handle
    //fetchNextResponse(currentResponse)
    //  .then((res: ChannelListResponse) => setCurrentResponse(res))
    //  .catch((err: Response) => setError(true));

    setPaginationCurrent(page);
  }

  /**
   * Fetches the next page of data relative to the current one.
   */
  function fetchNextResponse(response?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    const request: ApiYouTubeChannelListGetRequest = {
      part: 'id,snippet,contentDetails',
      mine: true,
      maxResults: maxResults,
    };

    if (response) {
      request.pageToken = response.nextPageToken;
    }

    return YOUTUBE_CHANNEL_API.apiYouTubeChannelListGet(request);
  }

  /**
   * Checks if additional data exists.
   */
  function canLoadMore(response: ChannelListResponse): boolean {
    return response == null || response.nextPageToken != null;
  }

  /**
   * Gets a row's unique key.
   */
  function rowKey(record: Channel): string {
    return record.id;
  }

  const mineYouTubeChannelsLength: number = mineYouTubeChannels ? mineYouTubeChannels.length : 0;

  console.log("STATE", radioGroupValue, mineYouTubeChannels, currentResponse, paginationCurrent, error);

  const [items, setItems] =
    React.useState<Array<any>>(undefined);

  return (
    <Row className="max-cell-sm">
      {error &&
        <Alert message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      <Radio.Group
        value={radioGroupValue}
        onChange={onChange}
        className={className}
      >
        <InfiniteScroll
          dataLength={items?.length}
          next={() => onChangePagination(paginationCurrent + 1)}
          hasMore={true}
          loader={<Row align="middle" justify="center" style={{ height: 120 }}><Spin /></Row>}
          height={400}
        >
          {items?.map((value, index: number) =>
            <div style={{
              height: 30,
              border: "1px solid green",
              margin: 6,
              padding: 8
            }} key={index}>
              div - #{index}
            </div>
          )}
        </InfiniteScroll>
      </Radio.Group>
    </Row>
  );
}

//<Radio.Button className="max-cell max-height" key={rowKey(channel)} value={channel.id}>
//  <BasicComboView
//    thumbnail={channel.snippet?.thumbnails._default}
//    title={channel.snippet?.title}
//    subtitle={channel.id}
//  />
//</Radio.Button>


//{
//  items.map((i, index) => (
//    <div style={{
//      height: 30,
//      border: "1px solid green",
//      margin: 6,
//      padding: 8
//    }} key={index}>
//      div - #{index}
//    </div>
//  ))
//}

//{
//  mineYouTubeChannels != null && mineYouTubeChannels.length === 0 && !canLoadMore(currentResponse) &&
//  <Alert message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
//}
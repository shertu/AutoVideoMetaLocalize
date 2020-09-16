import { Radio, Alert, Spin, Row } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../../../generated-sources/openapi';
import { RadioChangeEvent } from 'antd/lib/radio';
import InfiniteScroll from "react-infinite-scroll-component";

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();
const DEFAULT_PAGE_SIZE: number = 30;

let YouTubeChannelRadioGroup_ShouldLoadMore: boolean = false;

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
    React.useState<Array<Channel>>(undefined);

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

  // Hook to extract selected channel
  React.useEffect(() => {
    const channel: Channel = findMineYouTubeChannel(radioGroupValue);

    if (onChangeChannel) { onChangeChannel(channel); }
  }, [radioGroupValue]);

  // Hook to extract response page info
  React.useEffect(() => {
    if (onChangeResponse) { onChangeResponse(currentResponse); }
  }, [currentResponse]);

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

    console.log(page, paginationCurrent, pageSize);

    // error handle
    fetchNextResponse(currentResponse)
      .then((res: ChannelListResponse) => setCurrentResponse(res))
      .catch((err: Response) => setError(true));

    console.log("BEFORE", page, paginationCurrent, pageSize);
    setPaginationCurrent(page);
    console.log("AFTER", page, paginationCurrent, pageSize);
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

  return (
    <Row className="max-cell-sm">
      {error &&
        <Alert message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      <InfiniteScroll
        dataLength={this.state.items.length}
        next={() => onChangePagination(paginationCurrent + 1)}
        hasMore={canLoadMore(currentResponse)}
        loader={<Row key="infinite-scroll-loader" justify="center"><Spin /></Row>}
        className="max-cell"
      >
        <Radio.Group
          value={radioGroupValue}
          onChange={onChange}
          className={className}
        >
          {content.mineYouTubeChannels?.map((channel: Channel) =>
            <Radio.Button className="max-cell max-height" key={rowKey(channel)} value={channel.id}>
              <BasicComboView
                thumbnail={channel.snippet?.thumbnails._default}
                title={channel.snippet?.title}
                subtitle={channel.id}
              />
            </Radio.Button>
          )}
        </Radio.Group>
      </InfiniteScroll>
    </Row>
  );
}

//{
//  mineYouTubeChannels != null && mineYouTubeChannels.length === 0 && !canLoadMore(currentResponse) &&
//  <Alert message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
//}
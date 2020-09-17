import { Alert, Radio, Row, Spin } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import * as React from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { ApiYouTubeChannelListGetRequest, Channel, ChannelListResponse, YouTubeChannelApi } from '../../../../../../generated-sources/openapi';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';

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

  const [paginationExpectedTotal, setPaginationExpectedTotal] =
    React.useState<number>(0);

  const [error, setError] =
    React.useState<boolean>(false);

  /** The length of the current data collection. */
  const mineYouTubeChannelsLength: number = mineYouTubeChannels ? mineYouTubeChannels.length : 0;

  /** Used to append items to the data collection when the next response is loaded. */
  React.useEffect(() => {
    if (currentResponse) {
      let data: Channel[] = mineYouTubeChannels || []; // important to default data value
      data = data.concat(currentResponse.items);
      setMineYouTubeChannels(data);
    }
  }, [currentResponse]);

  /** Used to load the first page. */
  React.useEffect(() => {
    onChangePagination(1);
  }, []);

  /** Used to load items into the data collection until the length expectation is met or no additional item can be loaded. */
  React.useEffect(() => {
    if (mineYouTubeChannelsLength < paginationExpectedTotal && canLoadMore(currentResponse)) {
      fetchNextResponse(currentResponse)
        .then((res: ChannelListResponse) => setCurrentResponse(res))
        .catch((err: Response) => setError(true));
    }
  }, [paginationExpectedTotal, mineYouTubeChannelsLength]);

  /** Used to ensure a valid channel option is selected at all times. */
  React.useEffect(() => {
    const channel: Channel = findMineYouTubeChannel(radioGroupValue);

    if (channel == null && mineYouTubeChannelsLength > 0) {
      setRadioGroupValue(mineYouTubeChannels[0].id);
    }
  }, [mineYouTubeChannels]);

  /** Used to hook into the on change value event. */
  React.useEffect(() => {
    const channel: Channel = findMineYouTubeChannel(radioGroupValue);

    if (onChangeChannel) { onChangeChannel(channel); }
  }, [radioGroupValue]);

  /** Used to hook into the on change response event. */
  React.useEffect(() => {
    if (onChangeResponse) { onChangeResponse(currentResponse); }
  }, [currentResponse]);

  /** Called when the radio group's value changes. */
  function onChange(e: RadioChangeEvent) {
    setRadioGroupValue(e.target.value);
  }

  /** Used to find the specified channel by id from the data collection. */
  function findMineYouTubeChannel(channelId: string): Channel {
    return mineYouTubeChannels?.find((channel: Channel) => channel.id == channelId);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and page size as its arguments.
   */
  function onChangePagination(page: number, pageSize?: number): void {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const newPaginationExpectedTotal = page * pageSize;

    if (newPaginationExpectedTotal > paginationExpectedTotal) {
      setPaginationExpectedTotal(newPaginationExpectedTotal);
    }

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

  console.log("STATE", radioGroupValue, mineYouTubeChannels, currentResponse, paginationCurrent, error);

  return (
    <Row className="max-cell-sm">
      {error &&
        <Alert message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      {
        mineYouTubeChannelsLength === 0 && !canLoadMore(currentResponse) &&
        <Alert message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      <Radio.Group
        value={radioGroupValue}
        onChange={onChange}
        className={className}
      >
        <InfiniteScroll
          dataLength={mineYouTubeChannelsLength}
          next={() => onChangePagination(paginationCurrent + 1)}
          hasMore={canLoadMore(currentResponse)}
          loader={<Row align="middle" justify="center" style={{ height: 120 }}><Spin /></Row>}
        >
          {mineYouTubeChannels?.map((channel: Channel, index: number) =>
            <Radio.Button className="max-cell max-height" key={rowKey(channel)} value={channel.id}>
              <BasicComboView
                thumbnail={channel.snippet?.thumbnails._default}
                title={channel.snippet?.title}
                subtitle={channel.id}
              />
            </Radio.Button>
          )}
        </InfiniteScroll>
      </Radio.Group>
    </Row>
  );
}

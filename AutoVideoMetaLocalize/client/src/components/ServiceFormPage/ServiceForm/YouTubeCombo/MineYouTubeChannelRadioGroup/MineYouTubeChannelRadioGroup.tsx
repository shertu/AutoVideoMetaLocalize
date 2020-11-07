import {Alert, Avatar, List, Radio, Skeleton, Space, Typography} from 'antd';
import {RadioChangeEvent} from 'antd/lib/radio';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ApiYouTubeChannelListGetRequest, Channel, ChannelListResponse, Thumbnail, YouTubeChannelApi} from '../../../../../../generated-sources/openapi';

const {Text} = Typography;

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();
const DEFAULT_PAGE_SIZE: number = 30;

/**
 * A radio group component used to select one of the user's YouTube channels.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function MineYouTubeChannelRadioGroup(props: {
  onChangeChannel?: (channel: Channel) => void;
  onChangeResponse?: (response: ChannelListResponse) => void;
}): JSX.Element {
  const {onChangeChannel, onChangeResponse} = props;

  /** The current selected value of the radio group. */
  const [radioGroupValue, setRadioGroupValue] =
    React.useState<string>(undefined);

  /** The known YouTube channels associated with the user. */
  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>(undefined);

  /** The response from the latest item fetch. */
  const [currentResponse, setCurrentResponse] =
    React.useState<ChannelListResponse>(undefined);

  /** The current page index of the pagination. */
  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(undefined); // important to default data value

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    React.useState<number>(undefined);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(undefined);

  const dataLength: number = mineYouTubeChannels?.length || 0;
  const shouldLoadMore: boolean = dataLength < calculateWantedItemCount();
  const hasMore: boolean = canLoadMore(currentResponse);
  const shouldAndHasMore: boolean = shouldLoadMore && hasMore;

   console.log("MineYouTubeChannelRadioGroup State", radioGroupValue, mineYouTubeChannels, currentResponse, paginationCurrent, paginationSize, error);
   console.log("MineYouTubeChannelRadioGroup", dataLength, shouldLoadMore, hasMore, shouldAndHasMore);

  /** On fetching additional items, append the new items to the data collection. */
  React.useEffect(() => {
    if (currentResponse) {
      const data: Channel[] = mineYouTubeChannels || []; // important to default data value
      const {items} = currentResponse;

      if (items) {
        setMineYouTubeChannels(data.concat(items));
      }
    }
  }, [currentResponse]);

  /** On the initial mount, load the first page. */
  React.useEffect(() => {
    onChangePagination(1, DEFAULT_PAGE_SIZE);
  }, []);

  /** Load items into the data collection until the length expectation is met or no additional item can be loaded. */
  React.useEffect(() => {
    if (shouldAndHasMore) {
      buildNextFetchResponse(currentResponse)
          .then((res: ChannelListResponse) => setCurrentResponse(res))
          //.catch(() => setError(true));
    }
  }, [shouldAndHasMore, mineYouTubeChannels]);

  /** Ensure that a valid channel option is selected at all times when possible. */
  React.useEffect(() => {
    const channel: Channel = findMineYouTubeChannelById(radioGroupValue);

    if (channel == null && dataLength > 0) {
      setRadioGroupValue(mineYouTubeChannels[0].id);
    }
  }, [mineYouTubeChannels]);

  /** Used to hook into the on change value event. */
  React.useEffect(() => {
    const channel: Channel = findMineYouTubeChannelById(radioGroupValue);
    if (onChangeChannel) {
      onChangeChannel(channel);
    }
  }, [radioGroupValue]);

  /** Used to hook into the on change response event. */
  React.useEffect(() => {
    if (onChangeResponse) {
      onChangeResponse(currentResponse);
    }
  }, [currentResponse]);

  /**
  * Calculates the desired number of items in the item collection.
  *
  * @return {number}
  */
  function calculateWantedItemCount(): number {
    const a: number = paginationCurrent || 0;
    const b: number = paginationSize || 0;
    return a * b;
  }

  /**
   * The event called when the component's value changes.
   *
   * @param {RadioChangeEvent} e
   */
  function onChange(e: RadioChangeEvent): void {
    setRadioGroupValue(e.target.value);
  }

  /**
   * Used to find channel from the channel data collection by id.
   *
   * @param {string} channelId
   * @return {Channel}
   */
  function findMineYouTubeChannelById(channelId: string): Channel {
    return mineYouTubeChannels?.find((channel: Channel) => channel.id == channelId);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and page size as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    setPaginationCurrent(page);
    setPaginationSize(pageSize);
  }

  /**
   * Constructs a fetch op to get the next page of data for the specified response.
   *
   * @param {ChannelListResponse} response
   * @param {number} maxResults
   * @return {Promise<ChannelListResponse>}
   */
  function buildNextFetchResponse(response: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    const request: ApiYouTubeChannelListGetRequest = {
      part: 'id,snippet,contentDetails',
      mine: true,
      maxResults: maxResults,
      pageToken: response?.nextPageToken,
    };

    return YOUTUBE_CHANNEL_API.apiYouTubeChannelListGet(request);
  }

  /**
   * Checks if additional items can be loaded for the specified the response.
   *
   * @param {ChannelListResponse} response
   * @return {boolean}
   */
  function canLoadMore(response: ChannelListResponse): boolean {
    return response == null || response.nextPageToken != null;
  }

  /**
   * Gets a row's unique key.
   *
   * @param {Channel} record
   * @return {string}
   */
  function rowKey(record: Channel): string {
    return record.id;
  }

  return (
    <Space className="max-cell" direction="vertical">
      {error &&
        <Alert message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      {!dataLength && !hasMore &&
        <Alert message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      {!error &&
        <Radio.Group
          value={radioGroupValue}
          onChange={onChange}
          className="max-cell"
        >
          <InfiniteScroll
            dataLength={dataLength}
            next={() => onChangePagination(paginationCurrent + 1)}
            hasMore={hasMore}
            loader={<Skeleton loading active />}
          >
            {mineYouTubeChannels &&
              <List
                dataSource={mineYouTubeChannels}
                renderItem={(item: Channel) => {
                  const channelId: string = item.id;
                  const channelTitle: string = item.snippet.title;
                  const channelDefaultThumbnail: Thumbnail = item.snippet.thumbnails._default;

                  return (
                    <Radio.Button className="max-cell max-height" key={rowKey(item)} value={channelId}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="circle"
                            src={channelDefaultThumbnail.url}
                            style={{width: channelDefaultThumbnail.width, height: channelDefaultThumbnail.height}}
                          />
                        }
                        title={channelTitle}
                        description={<Text style={{fontFamily: 'monospace'}}>{channelId}</Text>}
                      />
                    </Radio.Button>
                  );
                }}
              />
            }
          </InfiniteScroll>
        </Radio.Group>
      }
    </Space>
  );
}


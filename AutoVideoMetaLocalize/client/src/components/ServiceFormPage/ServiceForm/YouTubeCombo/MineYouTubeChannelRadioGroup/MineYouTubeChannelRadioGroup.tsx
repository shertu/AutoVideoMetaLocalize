import {Alert, Radio, Skeleton} from 'antd';
import {RadioChangeEvent} from 'antd/lib/radio';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ApiYouTubeChannelListGetRequest, Channel, ChannelListResponse, YouTubeChannelApi} from '../../../../../../generated-sources/openapi';
import {BasicComboView} from '../../../../BasicComboView/BasicComboView';

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
    React.useState<number>(0); // important to default data value

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    React.useState<number>(undefined);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(undefined);

  const paginationExpectedTotal: number = paginationCurrent * paginationSize;
  const dataLength: number = mineYouTubeChannels ? mineYouTubeChannels.length : 0;
  const shouldAndCanLoadMore: boolean = dataLength < paginationExpectedTotal && canLoadMore(currentResponse);

  /** On fetching additional items, append the new items to the data collection. */
  React.useEffect(() => {
    if (currentResponse) {
      let data: Channel[] = mineYouTubeChannels || []; // important to default data value
      data = data.concat(currentResponse.items);
      setMineYouTubeChannels(data);
    }
  }, [currentResponse]);

  /** On the initial mount, load the first page. */
  React.useEffect(() => {
    onChangePagination(paginationCurrent + 1, DEFAULT_PAGE_SIZE);
  }, []);


  /** Load items into the data collection until the length expectation is met or no additional item can be loaded. */
  React.useEffect(() => {
    if (shouldAndCanLoadMore) {
      fetchNextResponse(currentResponse)
          .then((res: ChannelListResponse) => setCurrentResponse(res))
          .catch(() => setError(true));
    }
  }, [shouldAndCanLoadMore, mineYouTubeChannels]);

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
   * Fetches the next page of data relative to the specified response.
   *
   * @param {ChannelListResponse} response
   * @param {number} maxResults
   * @return {Promise<ChannelListResponse>}
   */
  function fetchNextResponse(response: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
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
    <>
      {error &&
        <Alert message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      {dataLength === 0 && !canLoadMore(currentResponse) &&
        <Alert message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      <Radio.Group
        value={radioGroupValue}
        onChange={onChange}
        className="max-cell"
      >
        <InfiniteScroll
          dataLength={dataLength}
          next={() => onChangePagination(paginationCurrent + 1)}
          hasMore={canLoadMore(currentResponse)}
          loader={<Skeleton loading active/>}
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
    </>
  );
}

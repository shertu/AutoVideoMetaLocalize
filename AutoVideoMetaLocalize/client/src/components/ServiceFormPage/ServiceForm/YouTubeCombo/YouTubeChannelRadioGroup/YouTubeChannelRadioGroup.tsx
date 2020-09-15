import { Radio, Alert, Spin, Row } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../../../generated-sources/openapi';
import { RadioChangeEvent } from 'antd/lib/radio';
import InfiniteScroll from 'react-infinite-scroller';

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
  const { onChangeChannel, onChangeResponse } = props;

  const [radioGroupValue, setRadioGroupValue] =
    React.useState<string>(undefined);

  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>(undefined);

  const [currentResponse, setCurrentResponse] =
    React.useState<ChannelListResponse>(undefined);

  //const [paginationCurrent, setPaginationCurrent] =
  //  React.useState<number>(0);

  const [loading, setLoading] =
    React.useState<boolean>(null);

  const [error, setError] =
    React.useState<boolean>(null);

  // hook to extract selected channel
  React.useEffect(() => {
    if (mineYouTubeChannels) {
      let selectedChannel: Channel = mineYouTubeChannels.find((channel: Channel) => channel.id == radioGroupValue);

      // if possible, a valid channel must be selected at all times
      if (selectedChannel == null && atLeastOneMineYouTubeChannel) {
        selectedChannel = mineYouTubeChannels[0];
        setRadioGroupValue(selectedChannel.id);
      }

      // hook to extract selected channel
      if (onChangeChannel) {
        onChangeChannel(selectedChannel);
      }
    }
  }, [radioGroupValue]);

  // hook to extract response page info
  React.useEffect(() => {
    if (onChangeResponse) {
      onChangeResponse(currentResponse);
    }
  }, [currentResponse]);

  /**
   * 
   * @param e
   */
  function onChange(e: RadioChangeEvent) {
    const selectedChannelId: string = e.target.value;
    setRadioGroupValue(selectedChannelId);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   */
  function onChangePagination(page: number, pageSize?: number): void {
    onChangePaginationAsync(page, pageSize);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   */
  async function onChangePaginationAsync(page: number, pageSize?: number): Promise<void> {
    if (loading) {
      return;
    }

    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const reqLen = page * pageSize;

    let tempStateResponse: ChannelListResponse = currentResponse;
    let tempStateData: Channel[] = mineYouTubeChannels || []; // important to default data value

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);

      // error handle
      tempStateResponse = await onFetchNext(tempStateResponse, pageSize)
        .catch(() => {
          setError(true);
          return null;
        });

      // break if an error occured
      if (tempStateResponse == null) {
        break;
      }

      tempStateData = tempStateData.concat(tempStateResponse.items);
    }

    setLoading(false);
    setCurrentResponse(tempStateResponse);
    setMineYouTubeChannels(tempStateData);
  }

  /**
   * Fetches the next page of data relative to the current one.
   */
  function onFetchNext(response?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
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

  // constants
  const atLeastOneMineYouTubeChannel: boolean = mineYouTubeChannels && mineYouTubeChannels.length > 0;

  return (
    <Row className="max-cell-sm">
      {error && mineYouTubeChannels == null &&
        <Alert message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      {!atLeastOneMineYouTubeChannel && !canLoadMore(currentResponse) &&
        <Alert message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      <InfiniteScroll
        className="max-cell"
        loadMore={onChangePagination}
        hasMore={canLoadMore(currentResponse)}
        loader={<Row key="infinite-scroll-loader" justify="center"><Spin /></Row>}
        useWindow={false}
      >
        <Radio.Group
          value={radioGroupValue}
          onChange={onChange}
        >
          {mineYouTubeChannels && mineYouTubeChannels.map((channel: Channel) =>
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


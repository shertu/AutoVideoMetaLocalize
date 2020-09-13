import { Radio, Alert, List, Spin, Row } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../../../generated-sources/openapi';
import { RadioGroupProps, RadioChangeEvent } from 'antd/lib/radio';
import InfiniteScroll from 'react-infinite-scroller';

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();
const DEFAULT_PAGE_SIZE: number = 30;

export interface YouTubeChannelRadioGroupProps extends RadioGroupProps {
  onChangeChannel?: (channel: Channel) => void;
  setResponseTotal?: (count: number) => void;
}

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @return {JSX.Element}
 */
export function YouTubeChannelRadioGroup(props: YouTubeChannelRadioGroupProps): JSX.Element {
  const { onChangeChannel, setResponseTotal } = props;

  const [value, setValue] =
    React.useState<string>(undefined);

  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>(undefined);

  const [currentResponse, setCurrentResponse] =
    React.useState<ChannelListResponse>(undefined);

  const [loading, setLoading] =
    React.useState<boolean>(false);

  const [error, setError] =
    React.useState<boolean>(false);

  console.log(value, mineYouTubeChannels, currentResponse, loading, error);

  // default value
  const atLeastOneMineYouTubeChannel: boolean = mineYouTubeChannels?.length > 0;
  const defaultValue: Channel = atLeastOneMineYouTubeChannel ? mineYouTubeChannels[0] : null;

  // total response count
  React.useEffect(() => {
    if (currentResponse && setResponseTotal) {
      setResponseTotal(currentResponse.pageInfo.totalResults);
    }
  }, [currentResponse]);

  /**
   * Called when the radio group selection is changed.
   */
  function onChange(e: RadioChangeEvent) {
    const value: string = e.target.value;
    const selectedChannel: Channel = mineYouTubeChannels.find((channel: Channel) => channel.id == value);

    setValue(value);
    onChangeChannel(selectedChannel);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    console.log("onChangePagination initiate");
    onChangePaginationAsync(page, pageSize);
    console.log("onChangePagination complete.");
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  async function onChangePaginationAsync(page: number, pageSize?: number): Promise<void> {
    console.log("onChangePaginationAsync initiate");
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const reqLen = page * pageSize;

    let tempStateResponse: ChannelListResponse = currentResponse;
    let tempStateData: Channel[] = mineYouTubeChannels;

    console.log("values", tempStateData?.length < reqLen, tempStateData?.length, reqLen, canLoadMore(tempStateResponse))
    while (tempStateData?.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);
      tempStateResponse = await onLoadNext(tempStateResponse, pageSize);

      if (tempStateResponse) {
        tempStateData = tempStateData.concat(tempStateResponse.items);
      }
    }

    setLoading(false);
    setCurrentResponse(tempStateResponse);
    setMineYouTubeChannels(tempStateData);
    console.log("onChangePaginationAsync complete.");
  }

  /**
   * Fetches the next page of data relative to the current one.
   * 
   * @param response
   * @param maxResults
   */
  function onLoadNext(response?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    console.log("onLoadNext initiate");
    const request: ApiYouTubeChannelListGetRequest = {
      part: 'id,snippet,contentDetails',
      mine: true,
      maxResults: maxResults,
    };

    if (response) {
      request.pageToken = response.nextPageToken;
    }

    console.log("onLoadNext complete.");
    return YOUTUBE_CHANNEL_API.apiYouTubeChannelListGet(request)
      .catch(() => {
        setError(true);
        return null;
      });
  }

  /**
   * Checks if additional data exists.
   * 
   * @param response
   */
  function canLoadMore(response: ChannelListResponse): boolean {
    return response == null || response.nextPageToken != null;
  }

  /**
   * Gets a row's unique key.
   * 
   * @param record
   */
  function rowKey(record: Channel): string {
    return record.id;
  }

  return (
    <Row className="max-cell-sm">
      {error && mineYouTubeChannels == null &&
        <Alert className="max-cell" message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      {!atLeastOneMineYouTubeChannel && !canLoadMore(currentResponse) &&
        <Alert className="max-cell" message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      <InfiniteScroll
        loadMore={onChangePagination}
        hasMore={canLoadMore(currentResponse)}
        loader={<Row key="infinite-scroll-loader" justify="center"><Spin /></Row>}
        useWindow={false}
      >
        <Radio.Group>
          {mineYouTubeChannels && mineYouTubeChannels.map((channel: Channel) =>
            <Radio.Button className="max-cell max-height" key={channel.id} value={channel.id}>
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

//<Radio.Group {...props}
//  value={value}
//  onChange={onChange}
//  defaultValue={defaultValue?.id}
//>
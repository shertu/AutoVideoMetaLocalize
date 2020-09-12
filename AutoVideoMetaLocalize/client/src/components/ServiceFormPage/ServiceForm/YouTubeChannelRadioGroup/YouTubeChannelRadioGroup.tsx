import { Radio, Alert, List, Spin } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../BasicComboView/BasicComboView';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../../generated-sources/openapi';
import { RadioGroupProps, RadioChangeEvent } from 'antd/lib/radio';
import { AuthorizedContent } from '../../../AuthorizedContent/AuthorizedContent';
import InfiniteScroll from 'react-infinite-scroller';

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();
const DEFAULT_PAGE_SIZE: number = 30;

export interface YouTubeChannelRadioGroupProps {
  value?: Channel;
  onChange?: (channel: Channel) => void;
  setResponseTotal?: (count: number) => void;
}

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @param props {RadioGroupProps}
 * @return {JSX.Element}
 */
export function YouTubeChannelRadioGroup(props: YouTubeChannelRadioGroupProps): JSX.Element {
  const { value, onChange, setResponseTotal } = props;

  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>(undefined);

  const [currentResponse, setCurrentResponse] =
    React.useState<ChannelListResponse>(undefined);

  const [loading, setLoading] =
    React.useState<boolean>(false);

  const [error, setError] =
    React.useState<boolean>(false);

  // default value
  const atLeastOneMineYouTubeChannel: boolean = mineYouTubeChannels != null && mineYouTubeChannels.length > 0;
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
  function onChangeActual(e: RadioChangeEvent) {
    const value: string = e.target.value;
    const selectedChannel: Channel = mineYouTubeChannels.find((channel: Channel) => channel.id == value);
    onChange(selectedChannel);
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    onChangePaginationAsync(page, pageSize)
      .catch(() => setError(true));
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  async function onChangePaginationAsync(page: number, pageSize?: number): Promise<void> {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const reqLen = page * pageSize;

    let tempStateResponse: ChannelListResponse = currentResponse;
    let tempStateData: Channel[] = mineYouTubeChannels;

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);
      tempStateResponse = await onLoadNext(tempStateResponse, pageSize);
      tempStateData = tempStateData.concat(tempStateResponse.items);
    }

    setLoading(false);
    setCurrentResponse(tempStateResponse);
    setMineYouTubeChannels(tempStateData);
  }

  /**
   * Fetches the next page of data relative to the current one.
   * 
   * @param response
   * @param maxResults
   */
  function onLoadNext(response?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
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
    return record.id; // The key is the video to correctly enable the form.
  }

  return (
    <AuthorizedContent>
      {error && mineYouTubeChannels == null &&
        <Alert className="max-cell-sm" message="Error" description="Failed to load YouTube channel information." type="error" showIcon />
      }

      {!atLeastOneMineYouTubeChannel && loading === false &&
        <Alert className="max-cell-sm" message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      <Radio.Group
        value={value.id}
        onChange={onChangeActual}
        defaultValue={defaultValue.id}
        className="max-cell-sm"
      >
        <InfiniteScroll
          loadMore={onChangePagination}
          hasMore={!loading && canLoadMore(currentResponse)}
          loader={<Spin key="infinite-scroll-loader" />}
          useWindow={false}
        >
          <List
            itemLayout="vertical"
            dataSource={mineYouTubeChannels}
            rowKey={rowKey}
            renderItem={(channel: Channel) => (
              <List.Item>
                <Radio.Button className="max-cell max-height" key={channel.id} value={channel.id}>
                  <BasicComboView
                    thumbnail={channel.snippet?.thumbnails._default}
                    title={channel.snippet?.title}
                    subtitle={channel.id}
                  />
                </Radio.Button>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Radio.Group>
    </AuthorizedContent >
  );
}


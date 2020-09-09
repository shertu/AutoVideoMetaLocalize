import { Radio, Alert, List, Row, Spin } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../BasicComboView/BasicComboView';
import { Channel, YouTubeChannelApi, ApiYouTubeChannelListGetRequest, ChannelListResponse } from '../../../../generated-sources/openapi';
import { RadioGroupProps, RadioChangeEvent } from 'antd/lib/radio';
import { AuthorizedContent } from '../../AuthorizedContent/AuthorizedContent';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();
const DEFAULT_PAGE_SIZE: number = 30;

export interface YouTubeChannelRadioGroupProps extends RadioGroupProps {
  onChangeChannel?: (channel: Channel) => void,
}

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @param props {RadioGroupProps}
 * @return {JSX.Element}
 */
export function YouTubeChannelRadioGroup(props: YouTubeChannelRadioGroupProps): JSX.Element {
  const { onChangeChannel } = props;

  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Array<Channel>>([]);

  const [response, setResponse] =
    React.useState<ChannelListResponse>(null);

  const [loading, setLoading] =
    React.useState<boolean>(null);

  const [error, setError] =
    React.useState<boolean>(null);

  const DEFAULT_VALUE: Channel = mineYouTubeChannels && mineYouTubeChannels.length ? mineYouTubeChannels[0] : null;

  React.useEffect(() => {
    if (onChangeChannel) { onChangeChannel(DEFAULT_VALUE); }
  }, [DEFAULT_VALUE]);

  /**
   * Called when the radio group selection is changed.
   */
  function onChangeValue(e: RadioChangeEvent) {
    const value: string = e.target.value;
    const selectedChannel: Channel = mineYouTubeChannels.find((channel: Channel) => channel.id == value);

    if (onChangeChannel) {
      onChangeChannel(selectedChannel);
    }
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    onChangePaginationAsync(page, pageSize);
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

    let tempStateResponse: ChannelListResponse = response;
    let tempStateData: Channel[] = mineYouTubeChannels;

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);
      tempStateResponse = await onLoadNext(tempStateResponse, pageSize);
      tempStateData = tempStateData.concat(tempStateResponse.items);
    }

    setLoading(false);
    setResponse(tempStateResponse);
    setMineYouTubeChannels(tempStateData);
  }

  /**
   * Fetches the next page of data relative to the current one.
   * 
   * @param currentResponse
   * @param maxResults
   */
  function onLoadNext(currentResponse?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    const request: ApiYouTubeChannelListGetRequest = {
      part: 'id,snippet,contentDetails',
      mine: true,
      maxResults: maxResults,
    };

    if (currentResponse) {
      request.pageToken = currentResponse.nextPageToken;
    }

    return YOUTUBE_CHANNEL_API.apiYouTubeChannelListGet(request);
  }

  /**
   * Checks if additional data exists.
   * 
   * @param currentResponse
   */
  function canLoadMore(currentResponse: ChannelListResponse): boolean {
    return currentResponse == null || currentResponse.nextPageToken != null;
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

      {mineYouTubeChannels && mineYouTubeChannels.length == 0 && loading === false &&
        <Alert className="max-cell-sm" message="Warning" description="No YouTube channels are associated with this Google account." type="warning" showIcon />
      }

      <Radio.Group {...props}
        defaultValue={DEFAULT_VALUE}
        onChange={onChangeValue}
        className="max-cell-sm"
      >
        <InfiniteScroll
          loadMore={onChangePaginationAsync}
          hasMore={!loading && canLoadMore(response)}
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


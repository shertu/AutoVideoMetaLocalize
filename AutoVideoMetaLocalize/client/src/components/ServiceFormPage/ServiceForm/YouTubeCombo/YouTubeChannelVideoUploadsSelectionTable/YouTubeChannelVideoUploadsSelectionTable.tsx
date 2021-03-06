import {Alert, Avatar, List, Skeleton, Space, Typography} from 'antd';
import Table, {ColumnsType, TablePaginationConfig} from 'antd/lib/table';
import * as React from 'react';
import {ApiYouTubePlaylistItemListGetRequest, Channel, PlaylistItem, PlaylistItemListResponse, Thumbnail, YouTubePlaylistItemApi} from '../../../../../../generated-sources/openapi';

const {Text} = Typography;

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();
const DEFAULT_PAGE_SIZE: number = 30;

const VIDEO_FORM_SELECTION_TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (_text: any, record: PlaylistItem) => {
    const playlistItemTitle: string = record.snippet.title;
    const playlistItemDefaultThumbnail: Thumbnail = record.snippet.thumbnails._default;
    const playlistItemPublishAt: Date = new Date(record.snippet.publishedAt);

    return (
      <List.Item.Meta
        avatar={
          <Avatar
            shape="square"
            src={playlistItemDefaultThumbnail.url}
            style={{width: playlistItemDefaultThumbnail.width, height: playlistItemDefaultThumbnail.height}}
          />
        }
        title={playlistItemTitle}
        description={<Text style={{fontFamily: 'monospace'}}>{playlistItemPublishAt.toLocaleString()}</Text>}
      />
    );
  },
}];

export interface YouTubeVideoSelectionTableProps {
  channel?: Channel;
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
}

/**
 * A table component used to select a subset of videos from a YouTube channel's uploaded videos.
 *
 * @param {YouTubeVideoSelectionTableProps} props
 * @return {JSX.Element}
 */
export function YouTubeChannelVideoUploadsSelectionTable(props: YouTubeVideoSelectionTableProps): JSX.Element {
  const {channel, value, onChange} = props;

  const channelUploadsPlaylistId = channel?.contentDetails?.relatedPlaylists.uploads;
  // if (!channelUploadsPlaylistId) {
  //  throw Error('The channel\'s upload playlist identifier is required.');
  // }

  /** The current selected value of the radio group. */
  // const [radioGroupValue, setRadioGroupValue] =
  //  React.useState<string>(undefined);

  /** The known playlist items associated with the Channel's upload playlist. */
  const [channelUploadsPlaylistItems, setChannelUploadsPlaylistItems] =
    React.useState<Array<PlaylistItem>>(undefined);

  /** The response from the latest item fetch. */
  const [currentResponse, setCurrentResponse] =
    React.useState<PlaylistItemListResponse>(undefined);

  /** The current page index of the pagination. */
  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(undefined); // important to default data value

  /** The current page size of the pagination. */
  const [paginationSize, setPaginationSize] =
    React.useState<number>(undefined);

  /** Has an error occured during a fetch op? */
  const [error, setError] =
    React.useState<boolean>(undefined);

  const dataLength: number = channelUploadsPlaylistItems?.length || 0;
  const shouldLoadMore: boolean = dataLength < calculateWantedItemCount();
  const hasMore: boolean = canLoadMore(currentResponse);
  const shouldAndHasMore: boolean = shouldLoadMore && hasMore;

  /** On fetching additional items, append the new items to the data collection. */
  React.useEffect(() => {
    if (currentResponse) {
      const data: Channel[] = channelUploadsPlaylistItems || []; // important to default data value
      const {items} = currentResponse;

      if (items) {
        setChannelUploadsPlaylistItems(data.concat(items));
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
          .then((res: PlaylistItemListResponse) => setCurrentResponse(res))
          .catch(() => setError(true));
    }
  }, [shouldAndHasMore, channelUploadsPlaylistItems]);

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
   * @param {PlaylistItemListResponse} response
   * @param {number} maxResults
   * @return {Promise<PlaylistItemListResponse>}
   */
  function buildNextFetchResponse(response: PlaylistItemListResponse, maxResults?: number): Promise<PlaylistItemListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'id,snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: maxResults,
      pageToken: response?.nextPageToken,
    };

    return YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
  }

  /**
   * Checks if additional items can be loaded for the specified the response.
   *
   * @param {PlaylistItemListResponse} response
   * @return {boolean}
   */
  function canLoadMore(response: PlaylistItemListResponse): boolean {
    return response == null || response.nextPageToken != null;
  }

  /**
   * Gets a row's unique key.
   *
   * @param {PlaylistItem} record
   * @return {string}
   */
  function rowKey(record: PlaylistItem): string {
    return record.snippet.resourceId.videoId;
  }

  // pagination props
  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    // position: ['topLeft'],
    simple: true,
    pageSize: paginationSize,
    total: currentResponse?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (
    <Space className="max-cell" direction="vertical">
      {error &&
        <Alert message="Error" description="Failed to load YouTube video information." type="error" showIcon />
      }

      {dataLength === 0 && !hasMore &&
        <Alert message="Warning" description="No YouTube videos are associated with this YouTube channel." type="warning" showIcon />
      }

      {!error &&
        <Skeleton loading={shouldAndHasMore} active>
          <Table
            dataSource={channelUploadsPlaylistItems}
            pagination={pagination}
            rowKey={rowKey}
            columns={VIDEO_FORM_SELECTION_TABLE_COLUMNS}
            rowSelection={{
              selectedRowKeys: value,
              onChange: onChange,
            }}
          />
        </Skeleton>
      }
    </Space>
  );
}


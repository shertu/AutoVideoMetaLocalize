import {Alert, Skeleton} from 'antd';
import Table, {ColumnsType, TablePaginationConfig} from 'antd/lib/table';
import * as React from 'react';
import {ApiYouTubePlaylistItemListGetRequest, Channel, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi} from '../../../../../../generated-sources/openapi';
import {BasicComboView} from '../../../../BasicComboView/BasicComboView';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();
const DEFAULT_PAGE_SIZE: number = 30;

const VIDEO_FORM_SELECTION_TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (_text: any, record: PlaylistItem) => {
    const view = <BasicComboView
      avatarShape="square"
      thumbnail={record.snippet.thumbnails._default}
      title={record.snippet.title}
      subtitle={record.snippet.publishedAt.toLocaleString()}
    />;

    return view;
  },
}];

export interface YouTubeVideoSelectionTableProps {
  channel?: Channel;
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
}

/**
 * A table component used to display and select from a paginated list of a YouTube channel's uploaded videos.
 *
 * @param {YouTubeVideoSelectionTableProps} props
 * @return {JSX.Element}
 */
export function YouTubeChannelVideoUploadsSelectionTable(props: YouTubeVideoSelectionTableProps): JSX.Element {
  const {channel, value, onChange} = props;

  const channelUploadsPlaylistId = channel?.contentDetails.relatedPlaylists.uploads;
  if (channelUploadsPlaylistId == null) {
    throw Error('The channel\'s upload playlist identifier is required.');
  }

  const [items, setItems] =
    React.useState<Array<PlaylistItem>>(undefined);

  const [currentResponse, setCurrentResponse] =
    React.useState<PlaylistItemListResponse>(undefined);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [paginationExpectedTotal, setPaginationExpectedTotal] =
    React.useState<number>(0); // important to default value

  const [error, setError] =
    React.useState<boolean>(undefined);

  const dataLength: number = items ? items.length : 0;
  const shouldAndCanLoadMore: boolean = dataLength < paginationExpectedTotal && canLoadMore(currentResponse);

  /** Used to append items to the data collection when the next response is loaded. */
  React.useEffect(() => {
    if (currentResponse) {
      let data: PlaylistItem[] = items || []; // important to default data value
      data = data.concat(currentResponse.items);
      setItems(data);
    }
  }, [currentResponse]);

  /** Used to load the first page. */
  React.useEffect(() => {
    onChangePagination(1);
  }, []);

  /** Used to load items into the data collection until the length expectation is met or no additional item can be loaded. */
  React.useEffect(() => {
    if (shouldAndCanLoadMore) {
      fetchNextResponse(currentResponse)
          .then((res: PlaylistItemListResponse) => setCurrentResponse(res))
          .catch((err: Response) => setError(true));
    }
  }, [paginationExpectedTotal, dataLength]);

  /**
   * Called when the page number is changed, and it takes the resulting page number and page size as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
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
   *
   * @param {PlaylistItemListResponse} response
   * @param {number} maxResults
   * @return {Promise<PlaylistItemListResponse>}
   */
  function fetchNextResponse(response: PlaylistItemListResponse, maxResults?: number): Promise<PlaylistItemListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'id,snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: maxResults,
    };

    if (response) {
      request.pageToken = response.nextPageToken;
    }

    return YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
  }

  /**
   * Checks if additional items can be loaded given the response.
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
    pageSize: DEFAULT_PAGE_SIZE,
    total: currentResponse?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (
    <>
      {error &&
        <Alert message="Error" description="Failed to load YouTube video information." type="error" showIcon />
      }

      {dataLength === 0 && !canLoadMore(currentResponse) &&
        <Alert message="Warning" description="No YouTube videos are associated with this YouTube channel." type="warning" showIcon />
      }

      <Skeleton loading={shouldAndCanLoadMore} active>
        <Table
          dataSource={items}
          pagination={pagination}
          rowKey={rowKey}
          columns={VIDEO_FORM_SELECTION_TABLE_COLUMNS}
          rowSelection={{
            selectedRowKeys: value,
            onChange: onChange,
          }}
        />
      </Skeleton>
    </>
  );
}


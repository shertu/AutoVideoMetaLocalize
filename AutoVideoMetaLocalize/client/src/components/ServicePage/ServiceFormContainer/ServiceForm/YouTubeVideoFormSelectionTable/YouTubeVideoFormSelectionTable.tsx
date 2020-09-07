import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { FormSelectionTable } from '../../../../FormSelectionTable/FormSelectionTable';
import { YouTubePlaylistItemApi, PlaylistItem, Channel, PlaylistItemListResponse, ApiYouTubePlaylistItemListGetRequest } from '../../../../../../generated-sources/openapi';
import { Spin, Skeleton } from 'antd';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

const VIDEO_FORM_SELECTION_TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (text, record, index) => {
    const view = <BasicComboView
      avatarShape="square"
      thumbnail={record.snippet.thumbnails._default}
      title={record.snippet.title}
      subtitle={record.snippet.publishedAt.toLocaleString()}
    />;

    return view;
  },
}];

const DEFAULT_PAGE_SIZE = 2;

/**
 * The table which displays a channel's videos.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function YouTubeVideoFormSelectionTable(props: {
  channel?: Channel,
  value?: React.Key[],
  onChange?: (value: React.Key[]) => void,
  initialData?: PlaylistItem[],
}): JSX.Element {
  const channelUploadsPlaylistId: string = props.channel?.contentDetails?.relatedPlaylists.uploads;

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [data, setData] =
    React.useState<PlaylistItem[]>(props.initialData || []);

  const [loading, setLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    onChangePagination(1, DEFAULT_PAGE_SIZE); // pagination starts at one
  }, []);

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    onChangePaginationAsync(page, pageSize)
      .catch((err) => console.log(err));
  }

  function canLoadMore(res: PlaylistItemListResponse): boolean {
    return res == null || res.nextPageToken != null;
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

    let tempStateResponse: PlaylistItemListResponse = response;
    let tempStateData: PlaylistItem[] = data;

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);

      tempStateResponse = await onLoadMore(pageSize);
      tempStateData = tempStateData.concat(tempStateResponse.items);
    }

    setLoading(false);

    setResponse(tempStateResponse);
    setData(tempStateData);
    setPaginationCurrent(page);
  }

  /**
   * Called when an additional page needs to be loaded.
   */
  async function onLoadMore(maxResults?: number): Promise<PlaylistItemListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: maxResults,
    };

    if (response) {
      request.pageToken = response.nextPageToken;
    }

    return await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request); 1
  }

  /**
   * Gets a row's unique key.
   *
   * @param {PlaylistItem} record
   * @param {number} index
   * @return {React.Key}
   */
  function rowKey(record: PlaylistItem): React.Key {
    return record.snippet.resourceId.videoId; // The key is the video to correctly enable the form.
  }

  // pagination props
  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (loading ?
    <Spin /> :
    <Skeleton loading={loading} paragraph={{ rows: 2 }} active>
      <FormSelectionTable
        table={{
          dataSource: data,
          pagination: pagination,
          rowKey: rowKey,
          columns: VIDEO_FORM_SELECTION_TABLE_COLUMNS,
        }}
        value={props.value}
        onChange={props.onChange}
      />
    </Skeleton>
  );
}


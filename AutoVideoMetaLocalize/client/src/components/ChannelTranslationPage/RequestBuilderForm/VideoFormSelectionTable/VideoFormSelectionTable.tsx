import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import { ApiYouTubePlaylistItemListGetRequest, Channel, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi } from '../../../../../generated-sources/openapi';
import { BasicComboView } from '../../../BasicComboView/BasicComboView';
import { FormSelectionTable } from '../../../FormSelectionTable/FormSelectionTable';
import './style.less';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

const VIDEO_FORM_SELECTION_TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (text, record, index) => {
    return (<BasicComboView
      avatarShape="square"
      thumbnail={record.snippet.thumbnails._default}
      title={record.snippet.title}
      subtitle={record.snippet.publishedAt.toLocaleString()}
    />);
  },
}];

/**
 * The table which displays a channel's videos.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function VideoFormSelectionTable(props: {
  channel?: Channel,
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void
}): JSX.Element {
  const channelUploadsPlaylistId: string = props.channel?.contentDetails?.relatedPlaylists.uploads;

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(null);

  console.log("ALPHA", channelUploadsPlaylistId, response, paginationCurrent);

  React.useEffect(() => {
    onChangePagination(paginationCurrent, 50);
  }, []);

  /**
   * 
   * @param page
   * @param pageSize
   */
  function onChangePagination(page: number, pageSize?: number) {
    onChangePaginationAsync(page, pageSize)
      .catch((err) => console.log(err))
  }

  /**
   *
   *
   * @param page
   * @param pageSize
   */
  async function onChangePaginationAsync(page: number, pageSize?: number) {
    // build request
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: pageSize,
    };

    let responseActual: PlaylistItemListResponse = response;
    let paginationCurrentActual: number = paginationCurrent;

    while (paginationCurrentActual !== page) {
      if (responseActual == null) {
        responseActual = await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
        paginationCurrentActual = 1;
      }

      if (paginationCurrentActual < page) {
        request.pageToken = responseActual.nextPageToken;
        responseActual = await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
        paginationCurrentActual++;
      }

      if (paginationCurrentActual > page) {
        request.pageToken = responseActual.prevPageToken;
        responseActual = await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
        paginationCurrentActual--;
      }

      console.log("BETA", channelUploadsPlaylistId, responseActual, paginationCurrentActual);
    }

    setResponse(responseActual);
    setPaginationCurrent(paginationCurrentActual);
  }

  /**
   * 
   * @param record
   * @param index
   */
  function rowKey(record: PlaylistItem, index?: number): React.Key {
    return record.snippet.resourceId.videoId;
  }

  // pagination props
  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (
    <FormSelectionTable
      table={{
        dataSource: response?.items,
        pagination: pagination,
        rowKey: rowKey,
        columns: VIDEO_FORM_SELECTION_TABLE_COLUMNS,
      }}
      value={props.value}
      onChange={props.onChange}
    />
  );
}


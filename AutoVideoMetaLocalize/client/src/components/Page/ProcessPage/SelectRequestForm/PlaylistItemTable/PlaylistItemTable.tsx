import {Table} from 'antd';
import {ColumnsType, TablePaginationConfig} from 'antd/lib/table';
import {TableRowSelection} from 'antd/lib/table/interface';
import * as React from 'react';
import {ApiYouTubePlaylistItemGetRequest, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi, Channel} from '../../../../../../generated-sources/openapi';
import {BasicComboCard} from '../../../../BasicComboCard/BasicComboCard';
import './style.less';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

const TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (text, record, index) => {
    return (<BasicComboCard
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
export function PlaylistItemTable(props: {
  playlistId: string,
  onChangeRowSelection: (selectedRowKeys: React.Key[], selectedRows: PlaylistItem[]) => void,
}): JSX.Element {
  const playlistId: string = props.playlistId;

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(1);

  const [selectedRowKeysState, setSelectedRowKeysState] =
    React.useState<React.Key[]>([]);

  React.useEffect(() => {
    onChangePagination(paginationCurrent);
  }, [playlistId]);

  /**
   *
   *
   * @param page
   * @param pageSize
   */
  async function onChangePagination(page: number, pageSize?: number) {
    if (playlistId) {
      // build request
      const request: ApiYouTubePlaylistItemGetRequest = {
        playlistId: playlistId,
      };

      // change page
      if (response) {
        if (page < paginationCurrent) {
          request.pageToken = response.prevPageToken;
        }

        if (page > paginationCurrent) {
          request.pageToken = response.nextPageToken;
        }
      }

      // change page size
      request.maxResults = pageSize;

      // fetch page
      YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet(request)
          .then((res) => setResponse(res));

      // set the page to the new value
      setPaginationCurrent(page);
    }
  }

  /**
   *
   * @param selectedRowKeys
   * @param selectedRows
   */
  async function onChangeRowSelection(selectedRowKeys: React.Key[], selectedRows: PlaylistItem[]) {
    setSelectedRowKeysState(selectedRowKeys);
    props.onChangeRowSelection(selectedRowKeys, selectedRows);
  }

  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
    showSizeChanger: true,
  };

  const rowSelection: TableRowSelection<PlaylistItem> = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKeysState,
    onChange: onChangeRowSelection,
  };

  return (
    <Table
      pagination={pagination}
      rowSelection={rowSelection}
      rowKey={(elem) => elem.snippet.resourceId.videoId}
      columns={TABLE_COLUMNS}
      dataSource={response?.items}
    />
  );
}

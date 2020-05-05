import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import * as React from 'react';
import { ApiYouTubePlaylistItemGetRequest, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi } from '../../../../../../generated-sources/openapi';
import { BasicComboCard } from '../../../../BasicComboCard/BasicComboCard';
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
    />)
  }
}];

/**
 * The table which displays a channel's videos.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function VideoSelectionTable(props: {
  playlistId: string,
  setVideos: React.Dispatch<React.SetStateAction<string[]>>,
}): JSX.Element {
  const request: ApiYouTubePlaylistItemGetRequest = {
    playlistId: props.playlistId,
  };

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(1);

  const [selectedKeys, setSelectedKeys] =
    React.useState<React.Key[]>([]);

  React.useEffect(() => {
    onChangePagination(paginationCurrent);
    props.setVideos(selectedKeys as string[]);
  }, []);

  function onChangePagination(page: number, pageSize?: number): void {
    if (response) {
      if (page < paginationCurrent) {
        request.pageToken = response.prevPageToken;
      }

      if (page > paginationCurrent) {
        request.pageToken = response.nextPageToken;
      }
    }

    request.maxResults = pageSize;

    YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet(request)
      .then((res) => setResponse(res))

    setPaginationCurrent(page);
  }

  function onChangeRowSelection(selectedRowKeys: React.Key[], selectedRows: PlaylistItem[]): void {
    setSelectedKeys(selectedRowKeys);
  }

  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
    //onShowSizeChange: onShowSizeChangePagination,
    showSizeChanger: true,
  }

  const rowSelection: TableRowSelection<PlaylistItem> = {
    type: 'checkbox',
    selectedRowKeys: selectedKeys,
    onChange: onChangeRowSelection,
  }

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

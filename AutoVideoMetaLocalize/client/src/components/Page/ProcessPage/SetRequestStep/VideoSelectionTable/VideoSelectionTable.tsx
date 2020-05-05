import * as React from 'react';
import './style.less';
import { YouTubePlaylistItemApi, Channel, PlaylistItemListResponse, PlaylistItem, ApiYouTubePlaylistItemGetRequest } from '../../../../../../generated-sources/openapi';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { PlaylistItemCard } from '../../../../PlaylistItemCard/PlaylistItemCard';
import { TableRowSelection } from 'antd/lib/table/interface';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

const TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (text, record, index) => {
    return (<PlaylistItemCard playlistItem={record} />)
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
  setVideos: React.Dispatch<React.SetStateAction<Array<string>>>,
}): JSX.Element {
  const request: ApiYouTubePlaylistItemGetRequest = {
    playlistId: props.playlistId,
  };

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [currentPage, setCurrentPage] =
    React.useState<number>(1);

  const [selectedRowKeys, setSelectedRowKeys] =
    React.useState<React.Key[]>([]);

  React.useEffect(() => {
    loadPageFromApi()
  }, []);

  function loadPageFromApi(): void {
    YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet(request)
      .then((res) => setResponse(res))
  }

  function onChangePagination(page: number, pageSize?: number): void {
    if (response) {
      if (page < currentPage) {
        request.pageToken = response.prevPageToken;
      }

      if (page > currentPage) {
        request.pageToken = response.nextPageToken;
      }
    }

    loadPageFromApi();
    setCurrentPage(page);
  }

  const pagination: TablePaginationConfig = {
    current: currentPage,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
  }

  async function onSelectAll(selected: boolean, selectedRows: PlaylistItem[], changeRows: PlaylistItem[]): Promise<void> {
    const temp: React.Key[] = [];

    if (selected) {
      // select
      const request_selectAll: ApiYouTubePlaylistItemGetRequest = {
        playlistId: props.playlistId,
      };

      let response_selectAll: PlaylistItemListResponse;

      do { // paginate items
        if (response_selectAll) {
          request_selectAll.pageToken = response_selectAll.nextPageToken;
        }

        response_selectAll = await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet(request);

        response.items.forEach((_) => {
          temp.push(_.id);
        });
      } while (!response_selectAll.nextPageToken);
    }

    setSelectedRowKeys(temp);
  }

  const rowSelection: TableRowSelection<PlaylistItem> = {
    type: 'checkbox',
    onSelectAll: onSelectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (aaa, bbb) => {
      console.log(aaa, bbb);
    }
  }

  return (
    <Table
      pagination={pagination}
      rowSelection={rowSelection}
      rowKey={(elem) => elem.id}
      columns={TABLE_COLUMNS}
      dataSource={response?.items}
    />
  );
}

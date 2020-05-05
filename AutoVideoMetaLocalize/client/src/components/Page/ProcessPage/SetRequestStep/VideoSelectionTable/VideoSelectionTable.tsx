import * as React from 'react';
import './style.less';
import { YouTubePlaylistItemApi, Channel, PlaylistItemListResponse, PlaylistItem, ApiYouTubePlaylistItemGetRequest } from '../../../../../../generated-sources/openapi';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { PlaylistItemCard } from '../../../../PlaylistItemCard/PlaylistItemCard';

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
}): JSX.Element {
  const request: ApiYouTubePlaylistItemGetRequest = {
    playlistId: props.playlistId,
  };

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [currentPage, setCurrentPage] =
    React.useState<number>(0);

  React.useEffect(() => {
    execute()
  }, []);

  function onChangePagination(page: number, pageSize?: number): void {
    if (response) {
      if (page < currentPage) {
        request.pageToken = response.prevPageToken;
      }

      if (page > currentPage) {
        request.pageToken = response.nextPageToken;
      }
    }

    execute();
    setCurrentPage(page);
  }

  function execute() {
    YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet(request)
      .then((res) => setResponse(res))
  }

  const pagination: TablePaginationConfig = {
    current: currentPage,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
  }

  return (
    <Table
      pagination={pagination}
      rowSelection={{
        type: 'checkbox',
      }}
      rowKey={(elem) => elem.id}
      columns={TABLE_COLUMNS}
      dataSource={response?.items}
    />
  );
}

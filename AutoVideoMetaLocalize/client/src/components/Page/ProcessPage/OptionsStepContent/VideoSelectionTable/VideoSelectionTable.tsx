import * as React from 'react';
import './style.less';
import {YouTubePlaylistItemApi} from '../../../../../../generated-sources/openapi';
import {Table} from 'antd';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

const TABLE_COLUMNS = [{
  title: 'Video Id',
  dataIndex: 'snippet.resourceId.videoId',
}, {
  title: 'Title',
  dataIndex: 'snippet.title',
}, {
  title: 'Description',
  dataIndex: 'snippet.description',
}];

/**
 * The table which displays a channel's videos.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function VideoSelectionTable(): JSX.Element {
  React.useEffect(() => {
    // const playlistId: string = props.channel.contentDetails.relatedPlaylists.uploads;

    // YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemVideosInPlaylistGet({
    //  playlistId: playlistId,
    //  pageToken: null,
    // }).then((res: PlaylistItemListResponse) => setSelectedVideos(res));
  }, []);

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
      }}
      columns={TABLE_COLUMNS}
      dataSource={null}
    />
  );
}

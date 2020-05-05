import * as React from 'react';
import './style.less';
import { YouTubePlaylistItemApi, Channel, PlaylistItemListResponse, PlaylistItem } from '../../../../../../generated-sources/openapi';
import { Table } from 'antd';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

interface VideoSelectionTableItem {

}

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
export function VideoSelectionTable(props: {
  channel?: Channel,
}): JSX.Element {
  const playlistId: string = props.channel?.contentDetails?.relatedPlaylists.uploads;

  const [items, setItems] =
    React.useState<Array<PlaylistItem>>(null);

  React.useEffect(() => {
    loadEveryItem();
  }, [playlistId]);

  async function loadEveryItem() {
    if (playlistId) {
      let token: string = null;
      let temp: Array<PlaylistItem> = [];

      do {
        const res = await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet({
          playlistId: playlistId,
          pageToken: token,
        });

        temp = [...temp, ...res.items];
        token = res.nextPageToken;
      } while (token == null);


      setItems(temp)
    }
  }

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
      }}
      columns={TABLE_COLUMNS}
      dataSource={items}
    />
  );
}

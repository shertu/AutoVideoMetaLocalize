import * as React from 'react';
import './style.less';
import {YouTubePlaylistItemApi, Channel, PlaylistItemListResponse, PlaylistItem, ApiYouTubePlaylistItemGetRequest} from '../../../../../../generated-sources/openapi';
import {Table} from 'antd';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

interface VideoSelectionTableItem {
  id: string,
  title: string,
}

const TABLE_COLUMNS = [{
  title: 'ID',
  dataIndex: 'id',
}, {
  title: 'Title',
  dataIndex: 'title',
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
  const request: ApiYouTubePlaylistItemGetRequest = {
    playlistId: playlistId,
  };

  const [items, setItems] =
    React.useState<Array<VideoSelectionTableItem>>(null);

  React.useEffect(() => {
    loadEveryItem();
  }, [playlistId]);

  async function loadEveryItem() {
    if (playlistId) {
      let token: string = null;
      const temp: Array<VideoSelectionTableItem> = [];

      do {
        if (token) {
          request.pageToken = token;
        }

        const response: PlaylistItemListResponse = await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemGet(request);

        response.items.forEach((_) => {
          const tempItem: VideoSelectionTableItem = {
            id: _.id,
            title: _.snippet.title,
          };

          temp.push(tempItem);
        });

        token = response.nextPageToken;
      } while (token == null);

      setItems(temp);
    }
  }

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
      }}
      rowKey={(elem) => elem.id}
      columns={TABLE_COLUMNS}
      dataSource={items}
    />
  );
}

import * as React from 'react';
import { YouTubePlaylistItemApi, PlaylistItem, Channel, PlaylistItemListResponse, ApiYouTubePlaylistItemListGetRequest } from '../../../../../../generated-sources/openapi';
import { Checkbox, List, Button, message, Row } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import './style.less';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();

interface VideoSelectionListProps extends CheckboxGroupProps {
  channel?: Channel,
}

/**
 * The table which displays a channel's videos.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function YouTubeVideoSelectionList(props: VideoSelectionListProps): JSX.Element {
  const { value, onChange, channel } = props;
  const channelUploadsPlaylistId: string = channel?.contentDetails?.relatedPlaylists?.uploads;

  const [loading, setLoading] =
    React.useState<boolean>(false);

  const [data, setData] =
    React.useState<Array<PlaylistItem>>([]);

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  React.useEffect(() => {
    onLoadMore();
  }, []);

  async function fetchNextPlaylistItemListResponse(): Promise<PlaylistItemListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'id,snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: 2,
    };

    if (response) {
      request.pageToken = response.nextPageToken;
    }

    return await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
  }

  function onLoadMore(): void {
    setLoading(true);

    fetchNextPlaylistItemListResponse()
      .then((res: PlaylistItemListResponse) => {
        setResponse(res);
        setData(data.concat(res.items));
        setLoading(false);

        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        //window.dispatchEvent(new Event('resize'));
      })
      .catch((err) => message.error("An error occured while fetching playlist items."));
  }

  /**
   * Gets a row's unique key.
   *
   * @param {PlaylistItem} record
   * @param {number} index
   * @return {React.Key}
   */
  function rowKey(record: PlaylistItem): string {
    return record.id;
  }

  const loadMoreButton: React.ReactNode =
    loading || (response && response.nextPageToken == null) ? null : (
      <Row align="middle" justify="center">
        <Button onClick={() => onLoadMore()}>loading more</Button>
      </Row>
    );

  return (
    <Checkbox.Group
      className="max-cell"
      value={value}
      onChange={onChange}
    >
      {data &&
        <List
          loading={loading}
          itemLayout="vertical"
          loadMore={loadMoreButton}
          dataSource={data}
          rowKey={rowKey}
          renderItem={item => (
            <List.Item>
              <Checkbox className="video-selection-list-checkbox" value={item.snippet.resourceId.videoId}>
                <div style={{ width: 420 }}>
                  <BasicComboView
                    avatarShape="square"
                    thumbnail={item.snippet.thumbnails._default}
                    title={item.snippet.title}
                    subtitle={item.snippet.publishedAt.toLocaleString()}
                  />
                </div>
              </Checkbox>
            </List.Item>
          )}
        />
      }
    </Checkbox.Group>
  );
}


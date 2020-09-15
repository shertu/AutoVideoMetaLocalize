import { Alert, Skeleton, Row } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, ChannelListResponse, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi, ApiYouTubePlaylistItemListGetRequest } from '../../../../../../generated-sources/openapi';
import { AuthorizedContent } from '../../../../AuthorizedContent/AuthorizedContent';
import Table, { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();
const DEFAULT_PAGE_SIZE: number = 30;

const VIDEO_FORM_SELECTION_TABLE_COLUMNS: ColumnsType<PlaylistItem> = [{
  title: 'Video',
  render: (_text: any, record: PlaylistItem) => {
    const view = <BasicComboView
      avatarShape="square"
      thumbnail={record.snippet.thumbnails._default}
      title={record.snippet.title}
      subtitle={record.snippet.publishedAt.toLocaleString()}
    />;

    return view;
  },
}];

export interface YouTubeVideoSelectionTableProps {
  youtubeChannel?: Channel;
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
  className?: string;
}

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @param props {RadioGroupProps}
 * @return {JSX.Element}
 */
export function YouTubeVideoSelectionTable(props: YouTubeVideoSelectionTableProps): JSX.Element {
  const { youtubeChannel, value, onChange, className } = props;
  const channelUploadsPlaylistId: string = youtubeChannel?.contentDetails?.relatedPlaylists.uploads;

  console.log("YouTubeVideoSelectionTable", props);

  const [channelUploadsPlaylistItems, setChannelUploadsPlaylistItems] =
    React.useState<Array<PlaylistItem>>(undefined);

  const [currentResponse, setCurrentResponse] =
    React.useState<PlaylistItemListResponse>(undefined);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [loading, setLoading] =
    React.useState<boolean>(null);

  const [error, setError] =
    React.useState<boolean>(null);

  React.useEffect(() => {
    if (youtubeChannel) {
      //setChannelUploadsPlaylistItems(null);
      //setCurrentResponse(null);
      onChangePagination(1); // pagination starts at one
    }
  }, [youtubeChannel]);

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   */
  function onChangePagination(page: number, pageSize?: number): void {
    onChangePaginationAsync(page, pageSize)
      //.catch(() => setError(true));
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   */
  async function onChangePaginationAsync(page: number, pageSize?: number): Promise<void> {
    if (loading) {
      return;
    }

    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const reqLen = page * pageSize;

    let tempStateResponse: PlaylistItemListResponse = currentResponse;
    let tempStateData: PlaylistItem[] = channelUploadsPlaylistItems || []; // important to default data value

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);

      // error handle
      tempStateResponse = await onFetchNext(tempStateResponse, pageSize)
        .catch(() => {
          setError(true);
          return null;
        });

      // break if an error occured
      if (tempStateResponse == null) {
        break;
      }

      tempStateData = tempStateData.concat(tempStateResponse.items);
    }

    setLoading(false);
    setCurrentResponse(tempStateResponse);
    setPaginationCurrent(page);
    setChannelUploadsPlaylistItems(tempStateData);
  }

  /**
   * Fetches the next page of data relative to the current one.
   */
  function onFetchNext(currentResponse?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'id,snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: maxResults,
    };

    if (currentResponse) {
      request.pageToken = currentResponse.nextPageToken;
    }

    return YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
  }

  /**
   * Checks if additional data exists.
   */
  function canLoadMore(currentResponse: ChannelListResponse): boolean {
    return currentResponse == null || currentResponse.nextPageToken != null;
  }

  /**
   * Gets a row's unique key.
   */
  function rowKey(record: PlaylistItem): string {
    return record.snippet.resourceId.videoId; // The key is the video to correctly enable the form.
  }

  // pagination props
  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    //position: ['topLeft'],
    simple: true,
    pageSize: currentResponse?.pageInfo.resultsPerPage,
    total: currentResponse?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (
    <Row className="max-cell-sm">
      {error && channelUploadsPlaylistItems == null &&
        <Alert className="max-cell" message="Error" description="Failed to load YouTube video information." type="error" showIcon />
      }

      {channelUploadsPlaylistItems && channelUploadsPlaylistItems.length == 0 && loading === false &&
        <Alert className="max-cell" message="Warning" description="No YouTube videos are associated with this YouTube channel." type="warning" showIcon />
      }

      <Skeleton loading={loading} active className={className}>
        <Table
          className={className}
          dataSource={channelUploadsPlaylistItems}
          pagination={pagination}
          rowKey={rowKey}
          columns={VIDEO_FORM_SELECTION_TABLE_COLUMNS}
          rowSelection={{
            selectedRowKeys: value,
            onChange: onChange,
          }}
        />
      </Skeleton>
    </Row>
  );
}


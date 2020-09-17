import { Alert, Skeleton, Row } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, ChannelListResponse, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi, ApiYouTubePlaylistItemListGetRequest } from '../../../../../../generated-sources/openapi';
import Table, { TablePaginationConfig, ColumnsType } from 'antd/lib/table';

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
  playlistId?: string;
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
  const { playlistId, value, onChange, className } = props;

  if (playlistId == null) {
    throw Error("The playlist id is required.");
  }

  const [channelUploadsPlaylistItems, setChannelUploadsPlaylistItems] =
    React.useState<Array<PlaylistItem>>([]);

  const [currentResponse, setCurrentResponse] =
    React.useState<PlaylistItemListResponse>(undefined);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [isLoading, setIsLoading] =
    React.useState<boolean>(false);

  const [error, setError] =
    React.useState<boolean>(false);

  const channelUploadsPlaylistItemsLength: number = channelUploadsPlaylistItems ? channelUploadsPlaylistItems.length : 0;

  // After the response is changed then append the items to the data set
  React.useEffect(() => {
    if (currentResponse) {
      let data: Channel[] = channelUploadsPlaylistItems || []; // important to default data value
      data = data.concat(currentResponse.items);
      setChannelUploadsPlaylistItems(data);
    }

    setIsLoading(false);
  }, [currentResponse]);

  // Initialize the first page
  React.useEffect(() => {
    onChangePagination(1); // pagination starts at one
  }, []);

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   */
  function onChangePagination(page: number, pageSize?: number): void {
    //pageSize = pageSize || DEFAULT_PAGE_SIZE;
    //const reqLen = page * pageSize;


    //let tempStateResponse: PlaylistItemListResponse = currentResponse;
    //let tempStateData: PlaylistItem[] = channelUploadsPlaylistItems || []; // important to default data value

    //if (mineYouTubeChannelsLength < newMaxDesiredContentLength && canLoadMore(currentResponse)) {
    //  fetchNextResponse(currentResponse)
    //    .then((res: ChannelListResponse) => setCurrentResponse(res))
    //    .catch((err: Response) => setError(true));
    //}

    //setCurrentResponse(tempStateResponse);
    //setPaginationCurrent(page);
    //setChannelUploadsPlaylistItems(tempStateData);
  }

  /**
   * Fetches the next page of data relative to the current one.
   */
  function onFetchNext(currentResponse?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'id,snippet',
      playlistId: playlistId,
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

      {channelUploadsPlaylistItems && channelUploadsPlaylistItems.length == 0 && isLoading === false &&
        <Alert className="max-cell" message="Warning" description="No YouTube videos are associated with this YouTube channel." type="warning" showIcon />
      }

      <Skeleton loading={isLoading} active className={className}>
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


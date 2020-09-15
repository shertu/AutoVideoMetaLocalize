import { Alert, Skeleton } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../../../BasicComboView/BasicComboView';
import { Channel, ChannelListResponse, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi, ApiYouTubePlaylistItemListGetRequest } from '../../../../../../generated-sources/openapi';
import { AuthorizedContent } from '../../../../AuthorizedContent/AuthorizedContent';
import { FormSelectionTable } from '../../../../FormSelectionTable/FormSelectionTable';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';

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
  youTubeChannel?: Channel;
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
}

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @param props {RadioGroupProps}
 * @return {JSX.Element}
 */
export function YouTubeVideoSelectionTable(props: YouTubeVideoSelectionTableProps): JSX.Element {
  const { youTubeChannel, value, onChange } = props;
  const channelUploadsPlaylistId: string = youTubeChannel?.contentDetails?.relatedPlaylists.uploads;

  const [channelUploadsPlaylistItems, setChannelUploadsPlaylistItems] =
    React.useState<Array<PlaylistItem>>(undefined);

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(undefined);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [loading, setLoading] =
    React.useState<boolean>(null);

  const [error, setError] =
    React.useState<boolean>(null);

  React.useEffect(() => {
    onChangePagination(1); // pagination starts at one
  }, []);

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
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const reqLen = page * pageSize;

    let tempStateResponse: PlaylistItemListResponse = response;
    let tempStateData: PlaylistItem[] = channelUploadsPlaylistItems || []; // important to default data value
    let tempStateLoading: boolean = loading;

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      if (tempStateLoading) {
        break;
      } else {
        tempStateLoading = true;
      }

      tempStateResponse = await onLoadNext(tempStateResponse, pageSize);

      if (tempStateResponse) {
        tempStateData = tempStateData.concat(tempStateResponse.items);
      } else {
        break;
      }
    }

    setLoading(false);
    setResponse(tempStateResponse);
    setChannelUploadsPlaylistItems(tempStateData);
    setPaginationCurrent(page);
  }

  /**
   * Fetches the next page of data relative to the current one.
   */
  function onLoadNext(currentResponse?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    if (channelUploadsPlaylistId == null) {
      return null;
    }

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
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (
    <AuthorizedContent>
      {error && channelUploadsPlaylistItems == null &&
        <Alert className="max-cell-sm" message="Error" description="Failed to load YouTube video information." type="error" showIcon />
      }

      {channelUploadsPlaylistItems && channelUploadsPlaylistItems.length == 0 && loading === false &&
        <Alert className="max-cell-sm" message="Warning" description="No YouTube videos are associated with this YouTube channel." type="warning" showIcon />
      }

      <Skeleton loading={loading} active className="max-cell-sm">
        <FormSelectionTable
          className="max-cell-sm"
          dataSource={channelUploadsPlaylistItems}
          pagination={pagination}
          rowKey={rowKey}
          columns={VIDEO_FORM_SELECTION_TABLE_COLUMNS}
          value={value}
          onChange={onChange}
        />
      </Skeleton>
    </AuthorizedContent >
  );
}


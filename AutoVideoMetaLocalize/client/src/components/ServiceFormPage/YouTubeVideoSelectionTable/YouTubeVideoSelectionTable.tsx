import { Alert, Row, Skeleton } from 'antd';
import * as React from 'react';
import { BasicComboView } from '../../BasicComboView/BasicComboView';
import { Channel, ChannelListResponse, Video, PlaylistItem, PlaylistItemListResponse, YouTubePlaylistItemApi, ApiYouTubePlaylistItemListGetRequest } from '../../../../generated-sources/openapi';
import { AuthorizedContent } from '../../AuthorizedContent/AuthorizedContent';
import { FormSelectionTable, FormSelectionTableProps } from '../../FormSelectionTable/FormSelectionTable';
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table';
import { SizeMe } from 'react-sizeme';

const YOUTUBE_PLAYLIST_ITEM_API = new YouTubePlaylistItemApi();
const DEFAULT_PAGE_SIZE: number = 3;

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

export interface YouTubeVideoSelectionTableProps extends FormSelectionTableProps<Video> {
  selectedMineYouTubeChannel?: Channel,
}

/**
 * A react component used to display a paginated list of the user's YouTube channels as a radio group.
 * 
 * @param props {RadioGroupProps}
 * @return {JSX.Element}
 */
export function YouTubeVideoSelectionTable(props: YouTubeVideoSelectionTableProps): JSX.Element {
  const { selectedMineYouTubeChannel, value, onChange } = props;
  const channelUploadsPlaylistId: string = selectedMineYouTubeChannel?.contentDetails?.relatedPlaylists.uploads;

  const [channelUploadsPlaylistItems, setChannelUploadsPlaylistItems] =
    React.useState<Array<PlaylistItem>>([]);

  const [response, setResponse] =
    React.useState<PlaylistItemListResponse>(null);

  const [paginationCurrent, setPaginationCurrent] =
    React.useState<number>(0);

  const [loading, setLoading] =
    React.useState<boolean>(null);

  const [error, setError] =
    React.useState<boolean>(null);

  const [maxHeight, setMaxHeight] =
    React.useState<number>(0);

  React.useEffect(() => {
    onChangePagination(1, DEFAULT_PAGE_SIZE); // pagination starts at one
  }, []);

  ///**
  // * Called when the radio group selection is changed.
  // */
  //function onChangeValue(e: RadioChangeEvent) {
  //  const value: string = e.target.value;
  //  const selectedChannel: Channel = mineYouTubeChannels.find((channel: Channel) => channel.id == value);

  //  if (onChangeChannel) {
  //    onChangeChannel(selectedChannel);
  //  }
  //}

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  function onChangePagination(page: number, pageSize?: number): void {
    onChangePaginationAsync(page, pageSize)
      .catch(() => setError(true));
  }

  /**
   * Called when the page number is changed, and it takes the resulting page number and pageSize as its arguments.
   *
   * @param {number} page
   * @param {number} pageSize
   */
  async function onChangePaginationAsync(page: number, pageSize?: number): Promise<void> {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;
    const reqLen = page * pageSize;

    let tempStateResponse: PlaylistItemListResponse = response;
    let tempStateData: PlaylistItem[] = channelUploadsPlaylistItems;

    while (tempStateData.length < reqLen && canLoadMore(tempStateResponse)) {
      setLoading(true);
      tempStateResponse = await onLoadNext(tempStateResponse, pageSize);
      tempStateData = tempStateData.concat(tempStateResponse.items);
    }

    setLoading(false);
    setResponse(tempStateResponse);
    setChannelUploadsPlaylistItems(tempStateData);
    setPaginationCurrent(paginationCurrent + 1);
  }

  /**
   * Fetches the next page of data relative to the current one.
   * 
   * @param currentResponse
   * @param maxResults
   */
  async function onLoadNext(currentResponse?: ChannelListResponse, maxResults?: number): Promise<ChannelListResponse> {
    const request: ApiYouTubePlaylistItemListGetRequest = {
      part: 'id,snippet',
      playlistId: channelUploadsPlaylistId,
      maxResults: maxResults,
    };

    if (currentResponse) {
      request.pageToken = currentResponse.nextPageToken;
    }

    return await YOUTUBE_PLAYLIST_ITEM_API.apiYouTubePlaylistItemListGet(request);
  }

  /**
   * Checks if additional data exists.
   * 
   * @param currentResponse
   */
  function canLoadMore(currentResponse: ChannelListResponse): boolean {
    return currentResponse == null || currentResponse.nextPageToken != null;
  }

  /**
   * Gets a row's unique key.
   * 
   * @param record
   */
  function rowKey(record: PlaylistItem): string {
    return record.snippet.resourceId.videoId; // The key is the video to correctly enable the form.
  }

  // pagination props
  const pagination: TablePaginationConfig = {
    current: paginationCurrent,
    simple: true,
    pageSize: response?.pageInfo.resultsPerPage,
    total: response?.pageInfo.totalResults,
    onChange: onChangePagination,
  };

  return (
    <AuthorizedContent>
      <Row align="top" justify="center">
        {error && channelUploadsPlaylistItems == null &&
          <Alert message="Error" description="Failed to load YouTube video information." type="error" showIcon />
        }

        {channelUploadsPlaylistItems && channelUploadsPlaylistItems.length == 0 && loading === false &&
          <Alert message="Error" description="No YouTube videos are associated with this YouTube channel." type="error" showIcon />
        }

        <SizeMe children={({ size }) => {
          setMaxHeight(size.height);

          return (
            <Skeleton loading={loading} active>
              <FormSelectionTable
                table={{
                  dataSource: channelUploadsPlaylistItems,
                  pagination: pagination,
                  rowKey: rowKey,
                  columns: VIDEO_FORM_SELECTION_TABLE_COLUMNS,
                  style: { height: maxHeight },
                }}
                value={value}
                onChange={onChange}
              />
            </Skeleton>
          );
        }} />
      </Row>
    </AuthorizedContent >
  );
}


import { Skeleton } from 'antd';
import * as React from 'react';
import { ApiYouTubeChannelListGetRequest, Channel, ChannelListResponse, YouTubeChannelApi } from '../../../../generated-sources/openapi';
import { Page } from '../../Page/Page';
import { YouTubeChannelSelectForm } from './YouTubeChannelSelectForm/YouTubeChannelSelectForm';
import { GoogleUnauthorizedResult } from '../GoogleUnauthorizedResult/GoogleUnauthorizedResult';

const YOUTUBE_CHANNEL_API: YouTubeChannelApi = new YouTubeChannelApi();

/**
 * The channel selection screen and content.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function MineYouTubeChannelSelectForm(props: {
  onFinishSelection?: (channel: Channel) => void,
}): JSX.Element {
  const [mineYouTubeChannels, setMineYouTubeChannels] =
    React.useState<Channel[]>(null);

  const [error, setError] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    fetchMineYouTubeChannelList()
      .then((res) => setMineYouTubeChannels(res))
      .catch((err) => setError(true));
  }, []);

  /** Fetches every YouTube channel from the user's Google account. */
  async function fetchMineYouTubeChannelList(): Promise<Channel[]> {
    let items: Channel[] = [];
    const req: ApiYouTubeChannelListGetRequest = {
      part: 'id,snippet,contentDetails',
      mine: true,
    };

    do {
      const response: ChannelListResponse = await YOUTUBE_CHANNEL_API.apiYouTubeChannelListGet(req);
      req.pageToken = response.nextPageToken;
      items = items.concat(response.items);
    } while (req.pageToken);

    return items;
  }

  if (error) { // standard error
    return <GoogleUnauthorizedResult />;
  }

  // render of YouTubeChannelSelectForm is delayed until options is defined to ensure default value is selected
  return (
    <Page title="YouTube Channel Selection">
      {mineYouTubeChannels ?
        <YouTubeChannelSelectForm
          name="MineYouTubeChannelSelection"
          options={mineYouTubeChannels}
          onFinishSelection={props.onFinishSelection}
        /> : <Skeleton />
      }
    </Page>
  );
}

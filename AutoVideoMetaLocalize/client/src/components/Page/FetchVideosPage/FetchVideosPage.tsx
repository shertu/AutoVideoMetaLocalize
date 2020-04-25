import * as React from 'react';
import './style.less';
import { DatePicker, Form, Button, message } from 'antd';
import { Page } from '../Page';
import { YouTubeApi, Channel } from '../../../../generated-sources/openapi';
import { Store } from 'antd/lib/form/interface';
import { RangeValue } from 'rc-picker/lib/interface';

const { RangePicker } = DatePicker;

const YOUTUBE_API: YouTubeApi = new YouTubeApi();

//const youtube = google.youtube('v3');

/**
 * A mailto link which provides the email address of the developer.
 *
 * @return {JSX.Element}
 */
export function FetchVideosPage(): JSX.Element {
  const [fetchError, setFetchError] =
    React.useState<boolean>(false);

  const [channels, setChannels] =
    React.useState<Channel[]>(null);

  React.useEffect(() => {
    YOUTUBE_API.apiYouTubeInstantiateServiceGet()
      .then((res) => setChannels(res))
      .catch((err) => {
        setFetchError(true);
        console.log(err);
        //message.error(err);
      })
  }, []);

  // RangeValue<DateType>
  function onChangeRangePicker(values: RangeValue<any>, formatString: [string, string]): void {
    console.log('Selected Time: ', values);
    console.log('Formatted Selected Time: ', formatString);
  }

  function onFinishForm(values: Store): void {

  }

  console.log(fetchError);
  console.log(channels);

  return (
    <Page id="fetch-videos-page">
      <Form onFinish={onFinishForm}>
        <Form.Item key={0} name="remember" valuePropName="checked">
          <RangePicker showTime onChange={onChangeRangePicker} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Page>
  );
}


import * as React from 'react';
import './style.less';
import { DatePicker, Form, Button } from 'antd';
import { Page } from '../Page';
import { RangeValue } from 'rc-picker/lib/interface';
import { Store } from 'antd/lib/form/interface';
import { GoogleAuthApi } from '../../../../generated-sources/openapi';
import { google } from 'googleapis';

const { RangePicker } = DatePicker;

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A mailto link which provides the email address of the developer.
 *
 * @return {JSX.Element}
 */
export function FetchVideosPage(): JSX.Element {

  //React.useEffect(() => {
  //  GOOGLE_AUTH_API.apiGoogleAuthGetTokenInformationGet()
  //    .then((res) => {
  //      const client = new google.auth.OAuth2({
  //        clientId: "539196681426-l6cnhj95rltbi7pi24gs3m8pt12agqom.apps.googleusercontent.com",
  //      };

  //      client.credentials.

  //      const youtube = google.youtube({
  //        version: 'v3',
  //        auth: sampleClient.oAuth2Client,
  //      });

  //    });
  //}, []);

  // DateType
  function onChangeRangePicker(values: RangeValue<any>, formatString: [string, string]): void {
    console.log('Selected Time: ', values);
    console.log('Formatted Selected Time: ', formatString);
  }

  function onFinishForm(values: Store): void {

  }

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

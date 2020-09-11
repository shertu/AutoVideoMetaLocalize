import { Button, Form, Row, Space, Carousel } from 'antd';
import * as React from 'react';
import { Channel, AppVideoLocalizeRequest, YouTubeVideoApi } from '../../../generated-sources/openapi';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import * as cookie from 'cookie';
import { Page } from '../Page/Page';
import { Store } from 'antd/lib/form/interface';
import { ServiceFormExecutionPage } from './ServiceFormExecutionPage/ServiceFormExecutionPage';
import EventStates from '../../event-states';
import { ServiceForm } from './ServiceForm/ServiceForm';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

const FORM_ITEM_NAMES = {
  LANGUAGE_SELECTION: 'language-selection',
  VIDEO_SELECTION: 'video-selection',
  SMB_CHECKBOX: 'smb-checkbox',
  //CHANNEL_RADIO_GROUP: 'channel-selection',
};

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [executionState, setExecutionState] =
    React.useState<EventStates>(EventStates.prospective);

  const [executionError, setExecutionError] =
    React.useState<boolean>(false);

  const [executionProgressMax, setExecutionProgressMax] =
    React.useState<number>(0);

  const [form] = Form.useForm();
  const carouselRef = React.useRef<Carousel>();

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: Store) {
    const LANGUAGE_SELECTION: string[] = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION] || [];
    const VIDEO_SELECTION: string[] = values[FORM_ITEM_NAMES.VIDEO_SELECTION] || [];
    const SMB_CHECKBOX: boolean = values[FORM_ITEM_NAMES.SMB_CHECKBOX] || false;

    const serviceFormInputs: AppVideoLocalizeRequest = {
      languages: LANGUAGE_SELECTION,
      videos: VIDEO_SELECTION,
      sheetMusicBoss: SMB_CHECKBOX,
    }

    console.log("Service form inputs: ", serviceFormInputs);
    executeService(serviceFormInputs);
  }

  /**
   * 
   * @param serviceFormInputs
   */
  function executeService(serviceFormInputs: AppVideoLocalizeRequest) {
    if (executionState == EventStates.prospective || executionState == EventStates.retropective) {
      setExecutionState(EventStates.continuitive);
      setExecutionError(false);
      setExecutionProgressMax(serviceFormInputs.videos.length * serviceFormInputs.languages.length);

      serializeLanguagesCookie();

      YOUTUBE_VIDEO_API.apiYouTubeVideoLocalizePut({
        appVideoLocalizeRequest: serviceFormInputs,
      }).then(() => {
        setExecutionState(EventStates.retropective);
      }).catch(() => {
        setExecutionState(EventStates.retropective);
        setExecutionError(true);
      });
    }
  }


  /**
   * Stores the current value of the languages form item into a cookie.
   */
  function serializeLanguagesCookie() {
    const LANGUAGE_SELECTION: string[] = form.getFieldValue(FORM_ITEM_NAMES.LANGUAGE_SELECTION) || [];
    document.cookie = cookie.serialize(FORM_ITEM_NAMES.LANGUAGE_SELECTION, LANGUAGE_SELECTION.join(','), {
      sameSite: 'lax',
    });
  }

  const showExecutionPage: boolean = executionState === EventStates.continuitive || executionState === EventStates.retropective;

  React.useEffect(() => {
    if (carouselRef && carouselRef.current) {
      const carouselTarget: number = showExecutionPage ? 1 : 0;
      carouselRef.current.goTo(carouselTarget);
    }
  }, [executionState]);

  return (
    <AuthorizedContent>
      <Carousel ref={carouselRef} dots={false}>
        <Page title="Service">
          <ServiceForm
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
            form={form}
          >
          </ServiceForm>
        </Page>

        <Page>
          <ServiceFormExecutionPage
            error={executionError}
            executionProgressMax={executionProgressMax}
            executionState={executionState}
          />

          <Row justify="end">
            <Space>
              <Button onClick={() => setExecutionState(EventStates.prospective)}>Return to Service Form</Button>
            </Space>
          </Row>
        </Page>
      </Carousel>
    </AuthorizedContent>
  );
}

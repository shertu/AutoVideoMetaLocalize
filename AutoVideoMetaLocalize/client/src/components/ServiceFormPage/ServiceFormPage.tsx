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
import ServiceFormItemNames from './ServiceFormItemNames';

const YOUTUBE_VIDEO_API: YouTubeVideoApi = new YouTubeVideoApi();

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
    const languageSelection: string[] = values[ServiceFormItemNames.LANGUAGE_SELECTION] || [];
    const videoSelection: string[] = values[ServiceFormItemNames.VIDEO_SELECTION] || [];
    const smbCheckbox: boolean = values[ServiceFormItemNames.SMB_CHECKBOX] || false;

    const serviceFormInputs: AppVideoLocalizeRequest = {
      languages: languageSelection,
      videos: videoSelection,
      sheetMusicBoss: smbCheckbox,
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

  /** Clears the form's fields and the language cookie. */
  function onClearServiceForm() {
    form.setFieldsValue({
      [ServiceFormItemNames.LANGUAGE_SELECTION]: [],
      [ServiceFormItemNames.VIDEO_SELECTION]: [],
      [ServiceFormItemNames.SMB_CHECKBOX]: false,
    });

    serializeLanguagesCookie();
  }

  /**
   * Stores the current value of the languages form item into a cookie.
   */
  function serializeLanguagesCookie() {
    const languageSelection: string[] = form.getFieldValue(ServiceFormItemNames.LANGUAGE_SELECTION) || [];
    document.cookie = cookie.serialize(ServiceFormItemNames.LANGUAGE_SELECTION, languageSelection.join(','), {
      sameSite: 'lax',
    });
  }

  const showExecutionPage: boolean = executionState === EventStates.continuitive || executionState === EventStates.retropective;

  React.useEffect(() => {
    const currentCarouselRef = carouselRef?.current;

    if (currentCarouselRef) {
      const carouselTargetIndex: number = showExecutionPage ? 1 : 0;
      currentCarouselRef.goTo(carouselTargetIndex);
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
            onClearFormInputs={onClearServiceForm}
          >
          </ServiceForm>
        </Page>
      </Carousel>
    </AuthorizedContent>
  );
}

//<Page>
//  <ServiceFormExecutionPage
//    error={executionError}
//    executionProgressMax={executionProgressMax}
//    executionState={executionState}
//  />

//  <Row justify="end">
//    <Space>
//      <Button onClick={() => setExecutionState(EventStates.prospective)}>Return to Service Form</Button>
//    </Space>
//  </Row>
//</Page>
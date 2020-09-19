import { Carousel } from 'antd';
import * as React from 'react';
import { AppVideoLocalizeRequest } from '../../../generated-sources/openapi';
import { AuthorizedContent } from '../AuthorizedContent/AuthorizedContent';
import { Page } from '../Page/Page';
import { ServiceForm, ServiceFormValues } from './ServiceForm/ServiceForm';
import { ServiceExecutionStatusPage } from './ServiceExecutionStatusPage/ServiceExecutionStatusPage';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServiceFormPage(): JSX.Element {
  const [request, setRequest] =
    React.useState<AppVideoLocalizeRequest>(undefined);

  const carouselRef = React.useRef<Carousel>();

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: ServiceFormValues) {
    // Important for form values to have fallbacks as most are initially undefined.
    const request: AppVideoLocalizeRequest = {
      languages: values.languageSelect || [],
      videos: values.youtubeVideoSelectionTable || [],
      sheetMusicBoss: values.smbCheckbox || false,
    }

    setRequest(request);
  }

  /** */
  React.useEffect(() => {
    const currentCarouselRef = carouselRef?.current;
    const carouselTargetIndex: number = request ? 1 : 0;

    if (currentCarouselRef) {
      currentCarouselRef.goTo(carouselTargetIndex);
    }
  }, [request]);

  return (
    <AuthorizedContent>
      <Carousel ref={carouselRef} dots={false}>
        <Page title="Service">
          <ServiceForm
            onFinish={onFinish}
          />
        </Page>

        <ServiceExecutionStatusPage
          request={request}
          onFinish={() => setRequest(undefined)}
        />
      </Carousel>
    </AuthorizedContent>
  );
}


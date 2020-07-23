import { Skeleton } from 'antd';
import * as React from 'react';
import { Channel, I18nLanguageSnippet, LanguageApi, SupportedLanguage } from '../../../../generated-sources/openapi';
import { AppVideoLocalizeRequest } from '../../../../generated-sources/openapi/models/AppVideoLocalizeRequest';
import { Page } from '../../Page/Page';
import { ServiceForm } from './ServiceForm/ServiceForm';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * The language and video selection screen and content.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ServiceFormContainer(props: {
  channel?: Channel,
  onFinishForm?: (configuration: AppVideoLocalizeRequest) => void,
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}): JSX.Element {
  const [cloudTranslationSupportedLanguages, setCloudTranslationSupportedLanguages] =
    React.useState<SupportedLanguage[]>(null);

  const [youTubeI18nLanguages, setYouTubeI18nLanguages] =
    React.useState<I18nLanguageSnippet[]>(null);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setCloudTranslationSupportedLanguages(res))
      .catch((err) => setCloudTranslationSupportedLanguages([])); // TODO

    LANGUAGE_API.apiLanguageYouTubeI18nLanguagesGet()
      .then((res) => setYouTubeI18nLanguages(res))
      .catch((err) => setYouTubeI18nLanguages([])); // TODO
  }, []);

  return (
    <Page title="Options">
      {(cloudTranslationSupportedLanguages && youTubeI18nLanguages) ?
        <ServiceForm
          {...props}
          cloudTranslationSupportedLanguages={cloudTranslationSupportedLanguages}
          youTubeI18nLanguages={youTubeI18nLanguages}
        /> : <Skeleton />
      }
    </Page>
  );
}

import * as React from 'react';
import { Channel, I18nLanguageSnippet, LanguageApi, SupportedLanguage } from '../../../generated-sources/openapi';
import { LanguageProvider } from '../LanguageContext/LanguageContext';
import { ChannelTranslationConfigurationForm } from './ChannelTranslationConfigurationForm/ChannelTranslationConfigurationForm';
import { GoogleUnauthorizedResult } from './GoogleUnauthorizedResult/GoogleUnauthorizedResult';
import { MineYouTubeChannelSelectForm } from './MineYouTubeChannelSelectForm/MineYouTubeChannelSelectForm';
import { ServiceExecutionPage } from './ServiceExecutionPage/ServiceExecutionPage';
import { ServiceFormInput } from './ServiceFormInput';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServicePage(): JSX.Element {
  const [currentStep, setCurrentStep] =
    React.useState<number>(0);

  const [serviceFormInputs, setServiceFormInputs] =
    React.useState<ServiceFormInput>(null);

  const [selectedChannel, setSelectedChannel] =
    React.useState<Channel>(null);

  // cached information

  const [googleTranslateSupportedLanguages, setGoogleTranslateSupportedLanguages] =
    React.useState<SupportedLanguage[]>(null);

  const [youTubeI18nLanguages, setYouTubeI18nLanguages] =
    React.useState<I18nLanguageSnippet[]>(null);

  const [googleFetchError, setGoogleFetchError] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setGoogleTranslateSupportedLanguages(res))
      .catch((err) => setGoogleFetchError(err));

    LANGUAGE_API.apiLanguageYouTubeI18nLanguagesGet()
      .then((res) => setYouTubeI18nLanguages(res))
      .catch((err) => setGoogleFetchError(err));
  }, []);

  /**
   * Called when the channel selection form is successfully filled out and submitted.
   *
   * @param {Channel} value
   */
  function onFinishChannelSelect(value: Channel) {
    setSelectedChannel(value);
    setServiceFormInputs({
      ...serviceFormInputs,
      videos: null,
    });
    setCurrentStep(currentStep + 1);
  }

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {ServiceFormInput} value
   */
  function onFinishInputForm(value: ServiceFormInput) {
    setServiceFormInputs(value);
    setCurrentStep(currentStep + 1);
  }

  /** Go to the previous page. */
  function decrementCurrent() {
    setCurrentStep(currentStep - 1);
  }

  /** Go back to the start of the channel translation process. */
  function onServiceCompletion() {
    setCurrentStep(1);
  }

  const content: React.ReactNode[] = [
    <MineYouTubeChannelSelectForm
      key={0}
      onFinishSelection={onFinishChannelSelect}
    />,
    <ChannelTranslationConfigurationForm
      key={1}
      channel={selectedChannel}
      onFinishForm={onFinishInputForm}
      onBack={decrementCurrent}
    />,
    <ServiceExecutionPage
      key={2}
      configuration={serviceFormInputs}
      onComplete={onServiceCompletion}
    />,
  ];

  if (googleFetchError) { // An error occured while attempting to fetch the user's YouTube information.
    return <GoogleUnauthorizedResult />;
  }

  return (
    <LanguageProvider value={{
      CloudTranslation: googleTranslateSupportedLanguages,
      YouTube: youTubeI18nLanguages,
    }}>
      <div className="steps-content">{content[currentStep]}</div>
    </LanguageProvider>
  );
}


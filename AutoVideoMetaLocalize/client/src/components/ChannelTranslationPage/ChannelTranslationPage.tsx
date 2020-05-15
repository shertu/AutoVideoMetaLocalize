import * as React from 'react';
import { Channel, LanguageApi, SupportedLanguage, I18nLanguageSnippet } from '../../../generated-sources/openapi';
import { ChannelTranslationConfiguration } from '../../ChannelTranslationConfiguration';
import { ChannelSelectForm } from './ChannelSelectForm/ChannelSelectForm';
import { ExecuteConfigurationPage } from './ExecuteConfigurationPage/ExecuteConfigurationPage';
import './style.less';
import { RequestBuilderForm } from './RequestBuilderForm/RequestBuilderForm';
import { TranslationLanguageProvider } from '../../context';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ChannelTranslationPage(): JSX.Element {
  const [current, setCurrent] =
    React.useState<number>(0);

  const [channel, setChannel] =
    React.useState<Channel>(null);

  const [configuration, setConfiguration] =
    React.useState<ChannelTranslationConfiguration>(null);

  const [googleTranslateLanguages, setGoogleTranslateLanguages] =
    React.useState<SupportedLanguage[]>(null);

  const [youtubeLanguages, setYoutubeLanguages] =
    React.useState<I18nLanguageSnippet[]>(null);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setGoogleTranslateLanguages(res));

    LANGUAGE_API.apiLanguageYouTubeI18nLanguagesGet()
      .then((res) => setYoutubeLanguages(res));
  }, []);

  /**
   *
   * @param value
   */
  function onFinishChannelSelect(value: Channel) {
    setChannel(value);
    setConfiguration({
      ...configuration,
      videoIds: null,
    });
    setCurrent(current + 1);
  }

  /**
   *
   * @param value
   */
  function onFinishRequestBuilder(value: ChannelTranslationConfiguration) {
    setConfiguration(value);
    setCurrent(current + 1);
  }

  /** Go to the previous page. */
  function decrementCurrent() {
    setCurrent(current - 1);
  }

  /** Go back to the start of the channel translation process. */
  function onCompleteExecution() {
    setCurrent(0);
  }

  const content: React.ReactNode[] = [
    <ChannelSelectForm
      onChange={onFinishChannelSelect}
    />,
    <RequestBuilderForm
      channel={channel}
      onFinish={onFinishRequestBuilder}
      onBack={decrementCurrent}
    />,
    <ExecuteConfigurationPage
      configuration={configuration}
      onComplete={onCompleteExecution}
    />,
  ];

  return (
    <TranslationLanguageProvider value={{
      GoogleTranslate: googleTranslateLanguages,
      YouTube: youtubeLanguages,
    }}>
      <div className="steps-content">{content[current]}</div>
    </TranslationLanguageProvider>
  );
}


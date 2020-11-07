import {Alert, message, Select, Space} from 'antd';
import * as React from 'react';
import {LanguageApi, SupportedLanguage, I18nLanguageSnippet} from '../../../../../generated-sources/openapi';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * A select component used to input the localization languages.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function LanguageSelect(props: {
  value?: Array<string>;
  onChange?: (value: Array<string>) => void;
}): JSX.Element {
  const {value, onChange} = props;

  /** The languages supported by Google Cloud Translate. */
  const [cloudTranslationSupportedLanguages, setCloudTranslationSupportedLanguages] =
    React.useState<Array<SupportedLanguage>>(undefined);

  /** The I18n languages supported by YouTube. */
  const [youTubeI18nLanguages, setYouTubeI18nLanguages] =
    React.useState<Array<I18nLanguageSnippet>>(undefined);

  /** On the initial mount, load the Google Cloud Translate and YouTube languages. */
  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
        .then((res) => setCloudTranslationSupportedLanguages(res))
        .catch(() => message.error('Failed to load Google Cloud Translate language information.'));

    LANGUAGE_API.apiLanguageYouTubeI18nLanguagesGet()
        .then((res) => setYouTubeI18nLanguages(res))
        .catch(() => message.error('Failed to load YouTube language information.'));
  }, []);

  /** The languages supported by both Google Cloud Translate and YouTube. */
  let languagesUnion: SupportedLanguage[];
  if (cloudTranslationSupportedLanguages && youTubeI18nLanguages) {
    const youTubeI18nLanguageCodes = youTubeI18nLanguages.map((language: I18nLanguageSnippet) => language.hl);
    languagesUnion = cloudTranslationSupportedLanguages.filter((language: SupportedLanguage) => youTubeI18nLanguageCodes.includes(language.languageCode));
  }

  return (
    <Select<Array<string>>
      mode="multiple"
      optionFilterProp="label"
      onChange={onChange}
      value={value}
    >
      {languagesUnion?.map((language: SupportedLanguage) =>
        <Select.Option key={language.languageCode} value={language.languageCode} label={language.displayName}>
          {language.displayName}
        </Select.Option >
      )}
    </Select>
  );
}


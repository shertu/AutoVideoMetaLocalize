import { Alert, Select } from 'antd';
import * as React from 'react';
import { I18nLanguageSnippet, LanguageApi, SupportedLanguage } from '../../../../../generated-sources/openapi';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function LanguageSelect(props: {
  value?: Array<string>;
  onChange?: (value: Array<string>) => void;
}): JSX.Element {
  const { value, onChange } = props;

  const [cloudTranslationSupportedLanguages, setCloudTranslationSupportedLanguages] =
    React.useState<Array<SupportedLanguage>>(undefined);

  const [youTubeI18nLanguages, setYouTubeI18nLanguages] =
    React.useState<Array<I18nLanguageSnippet>>(undefined);

  //const a = Select<Array<LabeledValue>>;
  

  const [error, setError] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setCloudTranslationSupportedLanguages(res))
      .catch(() => setError(true));

    LANGUAGE_API.apiLanguageYouTubeI18nLanguagesGet()
      .then((res) => setYouTubeI18nLanguages(res))
      .catch(() => setError(true));
  }, []);

  let languagesUnion: SupportedLanguage[] = null;
  if (cloudTranslationSupportedLanguages && youTubeI18nLanguages) {
    const youTubeI18nLanguageCodes = youTubeI18nLanguages.map(x => x.hl);
    languagesUnion = cloudTranslationSupportedLanguages.filter(x => youTubeI18nLanguageCodes.includes(x.languageCode));
  }

  return (
    <>
      {error &&
        <Alert message="Error" description="Failed to load Google Cloud Translate or YouTube language information." type="error" showIcon />
      }

      <Select<Array<string>>
        mode="multiple"
        optionFilterProp="label"
        onChange={onChange}
        value={value}
      >
        {languagesUnion?.map(language =>
          <Select.Option key={language.languageCode} value={language.languageCode} label={language.displayName}>
            {language.displayName}
          </Select.Option >
        )}
      </Select>
    </>
  );
}


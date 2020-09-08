import { Select, Space, Alert, Row } from 'antd';
import * as React from 'react';
import { SupportedLanguage, I18nLanguageSnippet, LanguageApi } from '../../../../generated-sources/openapi';
import { SelectProps } from 'antd/lib/select';
import { AuthorizedContent } from '../../AuthorizedContent/AuthorizedContent';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function LanguageSelect(props: SelectProps<string>): JSX.Element {
  const [cloudTranslationSupportedLanguages, setCloudTranslationSupportedLanguages] =
    React.useState<Array<SupportedLanguage>>(null);

  const [youTubeI18nLanguages, setYouTubeI18nLanguages] =
    React.useState<Array<I18nLanguageSnippet>>(null);

  const [error, setError] =
    React.useState<boolean>(null);

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
    <AuthorizedContent>
      <Row align="top">
        {error && cloudTranslationSupportedLanguages == null &&
          <Alert message="Error" description="Failed to load Google Could Translation or YouTube languages languages with this Google account." type="error" showIcon />
        }

        {error && youTubeI18nLanguages == null &&
          <Alert message="Error" description="Failed to load YouTube languages with this Google account." type="error" showIcon />
        }

        <Select {...props}
          mode="multiple"
          optionFilterProp="label"
        >
          {languagesUnion && languagesUnion.map(language =>
            <Select.Option key={language.languageCode} value={language.languageCode} label={language.displayName}>
              {language.displayName}
            </Select.Option >
          )}
        </Select>
      </Row>
    </AuthorizedContent >
  );
}


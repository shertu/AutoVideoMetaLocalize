import { Select, Alert, Row } from 'antd';
import * as React from 'react';
import { SupportedLanguage, I18nLanguageSnippet, LanguageApi, GetClaimsPrincipleResult } from '../../../../../generated-sources/openapi';
import { SelectProps } from 'antd/lib/select';
import UserContext from '../../../UserContext/UserContext';

const LANGUAGE_API: LanguageApi = new LanguageApi();

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function LanguageSelect(props: SelectProps<string>): JSX.Element {
  const user: GetClaimsPrincipleResult = React.useContext(UserContext);

  const [cloudTranslationSupportedLanguages, setCloudTranslationSupportedLanguages] =
    React.useState<Array<SupportedLanguage>>(undefined);

  const [youTubeI18nLanguages, setYouTubeI18nLanguages] =
    React.useState<Array<I18nLanguageSnippet>>(undefined);

  const [error, setError] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
      .then((res) => setCloudTranslationSupportedLanguages(res))
      .catch(() => setError(true));

    LANGUAGE_API.apiLanguageYouTubeI18nLanguagesGet()
      .then((res) => setYouTubeI18nLanguages(res))
      .catch(() => setError(true));
  }, [user]);

  let languagesUnion: SupportedLanguage[] = null;
  if (cloudTranslationSupportedLanguages && youTubeI18nLanguages) {
    const youTubeI18nLanguageCodes = youTubeI18nLanguages.map(x => x.hl);
    languagesUnion = cloudTranslationSupportedLanguages.filter(x => youTubeI18nLanguageCodes.includes(x.languageCode));
  }

  return (
    <Row className="max-cell-sm">
      {error &&
        <Alert className="max-cell" message="Error" description="Failed to load Google Cloud Translate or YouTube language information." type="error" showIcon />
      }

      <Select {...props} optionFilterProp="label">
        {languagesUnion?.map(language =>
          <Select.Option key={language.languageCode} value={language.languageCode} label={language.displayName}>
            {language.displayName}
          </Select.Option >
        )}
      </Select>
    </Row>
  );
}


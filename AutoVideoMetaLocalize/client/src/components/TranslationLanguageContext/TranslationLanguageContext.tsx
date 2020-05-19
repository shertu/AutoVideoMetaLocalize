import * as React from 'react';
import {I18nLanguageSnippet, SupportedLanguage} from '../../../generated-sources/openapi';

const TranslationLanguageContext = React.createContext<{
  YouTube?: I18nLanguageSnippet[],
  GoogleTranslate?: SupportedLanguage[],
}>(null);

export const TranslationLanguageProvider = TranslationLanguageContext.Provider;
export const TranslationLanguageConsumer = TranslationLanguageContext.Consumer;
export default TranslationLanguageContext;

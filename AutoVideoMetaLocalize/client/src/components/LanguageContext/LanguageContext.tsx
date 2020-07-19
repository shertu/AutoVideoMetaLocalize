import * as React from 'react';
import {I18nLanguageSnippet, SupportedLanguage} from '../../../generated-sources/openapi';

const LanguageContext = React.createContext<{
  YouTube?: I18nLanguageSnippet[],
  CloudTranslation?: SupportedLanguage[],
}>(null);

export const LanguageProvider = LanguageContext.Provider;
export const LanguageConsumer = LanguageContext.Consumer;
export default LanguageContext;

import * as React from 'react';
import './style.less';
import { AppSupportedLanguage, LanguageApi } from '../../../../../../generated-sources/openapi';
import { Select } from 'antd';

const LANGUAGE_API = new LanguageApi();

/**
 * The content for the step where the user is selecting options for the AVML process.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function LanguageSelect(): JSX.Element {
  const [options, setOptions] =
    React.useState<AppSupportedLanguage[]>(null);

  React.useEffect(() => {
    LANGUAGE_API.apiLanguageGoogleTranslateSupportedLanguagesGet()
        .then((res) => setOptions(res));
  }, []);

  return (
    <Select
      loading={options == null}
      mode="multiple"
      optionFilterProp="label"
    >
      {options && options.map((_) =>
        <Select.Option key={_.code} value={_.code} label={_.name}>
          {_.name}
        </Select.Option >,
      )}
    </Select>
  );
}

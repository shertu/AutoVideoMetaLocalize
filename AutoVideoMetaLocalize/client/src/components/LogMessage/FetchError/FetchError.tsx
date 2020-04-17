import * as React from 'react';
import './style.less';
import {MailToMe} from '../../MailToMe/MailToMe';
import {LogMessage} from '../LogMessage';

export function FetchError(): JSX.Element {
  return (
    <LogMessage className="fetch-error" title="An error occured while fetching data from the server" type="warning">
      Please refresh the page or&nbsp;
      <MailToMe subject="AutoVideoMetaLocalize fetch error">report the problem to a developer.</MailToMe>
    </LogMessage>
  );
}

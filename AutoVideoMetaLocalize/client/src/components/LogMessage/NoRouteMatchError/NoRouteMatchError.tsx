import * as React from 'react';
import './style.less';
import {MailToMe} from '../../MailToMe/MailToMe';
import {LogMessage} from '../LogMessage';

export function NoRouteMatchError(): JSX.Element {
  return (
    <LogMessage className="no-route-match-error" title="The URL and internal route mismatch" type="warning">
      Please check the URL for mispellings or&nbsp;
      <MailToMe subject="AutoVideoMetaLocalize no route match error">report the problem to a developer.</MailToMe>
    </LogMessage>
  );
}

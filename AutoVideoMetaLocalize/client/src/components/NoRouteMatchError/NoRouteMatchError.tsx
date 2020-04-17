import * as React from 'react';
import './style.less';
import {MailToMe} from '../MailToMe/MailToMe';
import {Typography} from 'antd';

const {Title, Paragraph} = Typography;

/**
 * The ui element for when a switch statement falls through.
 *
 * @return {JSX.Element}
 */
export function NoRouteMatchError(): JSX.Element {
  return (
    <Typography className="no-route-match-error">
      <Title level={2} type="warning">The URL and internal route mismatch</Title>
      <Paragraph>
        Please check the URL for mispellings or&nbsp;
        <MailToMe subject="AutoVideoMetaLocalize no route match error">report the problem to a developer.</MailToMe>
      </Paragraph>
    </Typography>
  );
}

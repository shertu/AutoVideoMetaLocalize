import {Typography} from 'antd';
import * as React from 'react';
import {MailToMe} from '../MailToMe/MailToMe';
import './style.less';

const {Title, Paragraph} = Typography;

/**
 * A component to be used for when a switch statement fails to match a route.
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

import * as React from 'react';
import './style.less';

export const MailToMe: React.FunctionComponent<{
  subject?: string,
}> = (props) => {
  return (
    <a href={`mailto:djared.xeknau@outlook.com?subject=${props.subject}&`}>
      {props.children}
    </a>
  );
};

import * as React from 'react';
import './style.less';
import classNames from 'classnames';
import {Typography} from 'antd';
import {BaseType} from 'antd/lib/typography/Base';

const {Title, Paragraph, Text} = Typography;

/**
 * Avoid ambiguous error message.
 * Error message should be succinct.
 * Avoid any technical jargon, e.g. error codes.
 * Be humble, calm and avoid negativity, write naturally.
 * Try to specify the cause (or potential causes) of the error.
 * Try to offer a solution to the error.
 */
export const LogMessage: React.FunctionComponent<{
  className?: string,
  type?: BaseType,
  title?: string,
}> = (props) => {
  const componentClass = classNames('log-message', props.className);

  return (
    <Typography className={componentClass}>
      <Title level={2} type={props.type}>{props.title}</Title>
      <Paragraph>
        {props.children}
      </Paragraph>
    </Typography>
  );
};

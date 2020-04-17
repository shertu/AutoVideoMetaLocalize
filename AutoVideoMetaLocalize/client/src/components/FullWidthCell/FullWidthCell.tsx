import * as React from 'react';
import './style.less';
import {Row, Col} from 'antd';
import classNames from 'classnames';

declare const Sizes: ["xs", "sm", "md", "lg", "xl"];

export interface FullWidthUnitProps {
  className?: string,
  size?: typeof Sizes[number],
}

/**
 * A page which center its elements and is full width up to a maximum
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export const FullWidthCell: React.FunctionComponent<FullWidthUnitProps> = (props) => {
  const rowClassName = classNames('full-width-cell', props.className);
  const colClassName = `full-width-${props.size || "md"}`;

  return (
    <Row className={rowClassName} align="top" justify="center">
      <Col className={colClassName}>
        {props.children}
      </Col>
    </Row>
  );
};

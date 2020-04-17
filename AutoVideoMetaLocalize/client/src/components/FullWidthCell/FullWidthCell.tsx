import * as React from 'react';
import './style.less';
import {Row, Col} from 'antd';
import classNames from 'classnames';

declare const Sizes: ["xs", "sm", "md", "lg", "xl"];

export interface FullWidthUnitProps {
  size?: typeof Sizes[number] | number,
  className?: string,
}

function isNumber(size?: typeof Sizes[number] | number): size is number {
  return (size as number).toPrecision !== undefined;
}

/**
 * A page which centers its elements and is full width up to a maximum.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export const FullWidthCell: React.FunctionComponent<FullWidthUnitProps> = (props) => {
  const rowClassName = classNames('full-width-cell', props.className);
  let colStyle: React.CSSProperties;
  let colClassName: string;

  // assign default value
  props.size = props.size || 'md';

  if (isNumber(props.size)) {
    colStyle = { maxWidth: props.size };
  } else {
    colClassName = `full-width-${props.size}`;
  }

  return (
    <Row className={rowClassName} align="top" justify="center">
      <Col className={colClassName} style={colStyle}>
        {props.children}
      </Col>
    </Row>
  );
};

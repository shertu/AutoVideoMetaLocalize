import {Col, Row} from 'antd';
import {RowProps} from 'antd/lib/grid/row';
import * as React from 'react';

const AutoColumnRowGutterDefault: number = 32;

/**
 * A row component which automatically renders its children in columns.
 *
 * @param {RowProps} props
 * @return {JSX.Element}
 */
function AutoColumnRow(props: RowProps): JSX.Element {
  const {children, style, ...other} = props;

  let childrenArr: React.ReactNodeArray = [];

  if (Array.isArray(children)) {
    childrenArr = children as React.ReactNodeArray;
  } else {
    childrenArr = [children];
  }

  return (
    <Row {...other} style={{...style, margin: 0}}>
      {childrenArr.map((_, i) =>
        <Col key={i}>{_}</Col>,
      )}
    </Row>
  );
};

export {AutoColumnRowGutterDefault, AutoColumnRow};

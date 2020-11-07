import {Card, Row} from 'antd';
import * as React from 'react';
import './style.less';

const {Meta} = Card;

export interface AppExplanationGridItemProps {
  cover?: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * A sub-component for the app explanation grid component.
 *
 * @param {AppExplanationGridItemProps} props
 * @return {JSX.Element}
 */
export function AppExplanationGridItem(props: AppExplanationGridItemProps): JSX.Element {
  const {cover, description} = props;

  return (
    <Card
      className="max-cell app-explanation-grid-card"
      cover={
        <Row align="middle" justify="center" className="max-height">
          {cover}
        </Row>
      }
    >
      <Meta description={description} />
    </Card>
  );
}

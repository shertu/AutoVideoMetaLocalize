import { Skeleton, Result, Button } from 'antd';
import * as React from 'react';
import UserContext from '../UserContext/UserContext';
import { GetClaimsPrincipleResult } from '../../../generated-sources/openapi';
import { Link } from 'react-router-dom';
import routes from '../../routes';

/**
 * A wrapper component which renders if the user is authenticated and authorized.
 * 
 * @param props
 */
export function AuthorizedContent(props: {
  children?: React.ReactNode,
}): JSX.Element {
  const user: GetClaimsPrincipleResult = React.useContext(UserContext);

  const content: React.ReactNode = user.isAuthenticated ? props.children :
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this part of the website."
      extra={
        <Link to={routes.ROUTE_HOME}>
          <Button type="primary">Go Home</Button>
        </Link>
      }
    />;

  return (
    <Skeleton loading={user == null}>
      {user && content}
    </Skeleton>
  );
};


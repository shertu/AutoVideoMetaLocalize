import {Skeleton, Result, Button} from 'antd';
import * as React from 'react';
import UserContext from '../UserContext/UserContext';
import {Link} from 'react-router-dom';
import routes from '../../routes';
import {GetClaimsPrincipleResult} from '../../../generated-sources/openapi';

/**
 * A wrapper component used to conditionally render its children when the user is authenticated.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function AuthorizedContent(props: {
  children?: React.ReactNode;
}): JSX.Element {
  const user: GetClaimsPrincipleResult = React.useContext(UserContext);

  return (
    <Skeleton loading={user == null}>
      {user?.isAuthenticated ?
        props.children :
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this part of the website."
          extra={
            <Link to={routes.ROUTE_HOME}>
              <Button type="primary">Go Home</Button>
            </Link>
          }
        />
      }
    </Skeleton>
  );
};


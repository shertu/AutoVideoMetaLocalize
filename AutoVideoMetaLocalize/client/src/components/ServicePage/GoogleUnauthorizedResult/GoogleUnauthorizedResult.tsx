import { Result, Button } from 'antd';
import * as React from 'react';
import UserContext from '../../UserContext/UserContext';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

/**
 * The channel selection screen and content.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function GoogleUnauthorizedResult(): JSX.Element {
  const user = React.useContext(UserContext);

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this part of the website. Please, sign in to this application through Google with the YouTube and Cloud Translate options enabled."
      extra={
        <Link to={routes.ROUTE_HOME}>
          <Button type="primary">Go Home</Button>
        </Link>
      }
    />
  );
}

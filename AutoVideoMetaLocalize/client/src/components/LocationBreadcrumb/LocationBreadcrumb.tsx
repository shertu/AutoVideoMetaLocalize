import {HomeFilled} from '@ant-design/icons';
import {Breadcrumb} from 'antd';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BreadcrumbProps} from 'antd/lib/breadcrumb';

/**
 * A breadcrumb component for the window's location.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function LocationBreadcrumb(props: BreadcrumbProps): JSX.Element {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={index}>
        <Link to={url}>{_}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">
        <HomeFilled />
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <Breadcrumb {...props}>
      {breadcrumbItems}
    </Breadcrumb>
  );
}

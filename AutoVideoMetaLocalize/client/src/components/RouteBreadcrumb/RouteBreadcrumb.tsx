import * as React from 'react';
import {Breadcrumb} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import './style.less';
import {HomeFilled} from '@ant-design/icons';

export function RouteBreadcrumb(): JSX.Element {
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
    <Breadcrumb className="route-breadcrumb">
      {breadcrumbItems}
    </Breadcrumb>
  );
}

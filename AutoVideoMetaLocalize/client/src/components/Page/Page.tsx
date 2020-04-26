import * as React from 'react';
import './style.less';

/**
 * The main content of this web application.
 * Contains the steps flow use throughout the application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export const Page: React.FunctionComponent<{
  id?: string,
}> = (props) => {
  return (
    <section id={props.id} className="max-cell-lg">
        {props.children}
    </section>
  );
};


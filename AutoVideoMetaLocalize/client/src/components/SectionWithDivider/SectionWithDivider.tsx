import * as React from 'react';
import {Divider} from 'antd';
import './style.less';

/**
 * A section with with a divider to seperate it from other sections.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export const DividedSection: React.FunctionComponent<{
  title: string,
}> = (props: { title: string, children: React.ReactNode }) => {
  const sectionId: string = props.title.replace(/\W+/g, '-').toLowerCase();

  return (
    <section id={sectionId} className="section-with-divider">
      <Divider>
        {props.title}
      </Divider>
      {props.children}
    </section>
  );
};

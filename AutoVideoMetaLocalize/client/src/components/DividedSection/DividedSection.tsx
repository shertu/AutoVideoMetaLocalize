import * as React from 'react';
import {Divider} from 'antd';
import './style.less';

export const DividedSection: React.FunctionComponent<{
  title: string,
}> = (props) => {
  const sectionId: string = props.title.replace(/\W+/g, '-').toLowerCase();

  return (
    <section id={sectionId} className="divided-section">
      <Divider>
        {props.title}
      </Divider>
      {props.children}
    </section>
  );
};

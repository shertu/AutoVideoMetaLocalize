import {ArrowUpOutlined} from '@ant-design/icons';
import {Statistic} from 'antd';
import * as React from 'react';
import chance from '../../../chance';
import {useInterval} from '../../../custom-react-hooks';
import {AutoColumnRow, AutoColumnRowGutterDefault} from '../../AutoColumnRow/AutoColumnRow';
import {AppExplanationGridItem} from './AppExplanationGridItem/AppExplanationGridItem';

/**
 * A view component used to explain how this web application is useful.
 *
 * @return {JSX.Element}
 */
export function AppExplanationGrid(): JSX.Element {
  const [viewCount, setViewCount] =
    React.useState<number>(927787);

  useInterval(800, incrementViewCount);

  /** Increments the view count state. */
  function incrementViewCount() {
    const incrementValue: number = chance.natural({max: 256});
    setViewCount(viewCount + incrementValue);
  }

  return (
    <AutoColumnRow align="middle" justify="center" gutter={[AutoColumnRowGutterDefault, AutoColumnRowGutterDefault]}>
      <AppExplanationGridItem
        cover={<img alt="example" src="https://i.imgur.com/tjyteuS.png" className="image-cover" />}
        description="YouTube tends to recommend content which is local to the viewer, e.g. Australian-made content for Australian viewers."
      />

      <AppExplanationGridItem
        cover={<img alt="example" src="https://i.imgur.com/Y5n3QJH.png" width={110} />}
        description="This service can localize the titles and descriptions of your YouTube videos through Google translate."
      />

      <AppExplanationGridItem
        cover={<Statistic
          title="View Count"
          value={viewCount}
          valueStyle={{color: '#3f8600'}}
          prefix={<ArrowUpOutlined />}
          suffix="views"
          style={{textAlign: 'center'}}
        />}
        description="Conseqently, the content affected by this service becomes accessible to a larger audience."
      />
    </AutoColumnRow>
  );
}

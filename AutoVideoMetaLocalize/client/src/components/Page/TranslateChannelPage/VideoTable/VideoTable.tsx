//import * as React from 'react';
//import './style.less';
//import {Table} from 'antd';
//import {TranslateChannelApi} from '../../../../../generated-sources/openapi';

//const TRANSLATE_CHANNEL_API = new TranslateChannelApi();

///**
// * A page which shows the progress of the AVML process for the current user.
// *
// * @param {object} props
// * @return {JSX.Element}
// */
//export function VideoTable(props: {
//  //videos: Video[],
//}): JSX.Element {
//  const continuitive: boolean = props.continuitive || false;

//  React.useEffect(() => {
//    if (continuitive) {
//      // TRANSLATE_CHANNEL_API
//    }
//  }, []);

//  const [progress, setProgress] =
//    React.useState<number>(0);

//  return (
//    <Table
//      rowSelection={{
//        type: selectionType,
//        ...rowSelection,
//      }}
//      columns={columns}
//      dataSource={data}
//    />
//  );
//}

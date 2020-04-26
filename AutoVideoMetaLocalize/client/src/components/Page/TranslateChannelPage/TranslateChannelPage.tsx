import * as React from 'react';
import './style.less';
import { Page } from '../Page';
import { Channel } from '../../../../generated-sources/openapi';
import { PageHeader } from 'antd';

//interface StepItem {
//  title: string,
//  node: React.ReactNode,
//}

//const steps: Array<StepItem> = [{
//  title: "sign in",
//  node: (<GoogleAuthPage />)
//}, {
//  title: "fetch",
//  node: (<FetchVideosPage />)
//}, {
//  title: "translate",
//  node: (<div />)
//}, {
//  title: "update",
//  node: (<div />)
//}]

/**
 * A page which guides the AVML process for a specific channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function TranslateChannelPage(props: {
  channel: Channel,
  setSelectedChannel: React.Dispatch<React.SetStateAction<Channel>>
}): JSX.Element {
  return (
    <Page id="translate-channel-page">
      <PageHeader
        className="site-page-header"
        title="Options"
        onBack={() => props.setSelectedChannel(null)}
      />
    </Page>
  );
}

import * as React from 'react';
import {Page} from '../Page/Page';
import {Typography} from 'antd';
import names from '../../names';

const {Paragraph, Text, Title} = Typography;

/**
 * This page outlines the rights of the user in regards to their online privacy while using this web application.
 *
 * @return {JSX.Element}
 */
export function PrivacyPolicyPage(): JSX.Element {
  return (
    <Page>
      <Typography>
        <Title level={1}>Privacy Policy for {names.APPLICATION.toUpperCase()}</Title>

        <Paragraph>This Privacy Policy document outlines how information about <Text strong>you</Text> is collected and used whilst you visit this website.</Paragraph>

        <Paragraph>Further use of this website is to be considered <Text strong>consent</Text> to our Privacy Policy and agreemnent to its terms.</Paragraph>

        <Title level={2}>How we collect and use your information</Title>

        <Paragraph>
          This website will never store personal information such as your name, email address, phone number, etc.
        </Paragraph>

        <Paragraph>
          This website will use https://www.googleapis.com/auth/youtube to read the titles and descriptions of your YouTube channel&#39;s uploaded videos
          as well as to update the localizations of your YouTube channel&#39;s uploaded videos.
        </Paragraph>

        <Title level={2}>Cookies</Title>

        <Paragraph>
          This website, like many other websites, uses computer cookies to help keep track of your preferences, authenticaiton session, etc.
        </Paragraph>
      </Typography>
    </Page>
  );
}

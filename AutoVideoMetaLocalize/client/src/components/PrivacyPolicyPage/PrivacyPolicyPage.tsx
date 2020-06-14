import * as React from 'react';
import { Page } from '../Page/Page';
import { Typography } from 'antd';

const { Paragraph, Text, Title } = Typography;

/**
 * This page outlines the rights of the user in regards to their online privacy while using this web application.
 *
 * @return {JSX.Element}
 */
export function PrivacyPolicyPage(): JSX.Element {
  return (
    <Page>
      <Typography>
        <Title level={1}>Privacy Policy for BLACKMAN, JARED MICHAEL</Title>

        <Paragraph>This Privacy Policy document outlines how information about <Text strong>you</Text> is collected and used whilst you visit this website.</Paragraph>

        <Paragraph>Further use of this website is to be considered <Text strong>consent</Text> to our Privacy Policy and agreemnent to its terms.</Paragraph>

        <Title level={2}>How we collect and use your information</Title>

        <Paragraph>
          This website will never store personal information such as your name, email address, phone number, etc.
        </Paragraph>

        <Paragraph>
          This website will use https://www.googleapis.com/auth/youtube to read the titles and descriptions of your YouTube channel's uploaded videos 
          as well as to update the localizations of your YouTube channel's uploaded videos.
        </Paragraph>

        <Paragraph>
          This website will use https://www.googleapis.com/auth/cloud-translation to translate the titles and descriptions of some YouTube videos 
          for the purpose of then updating their localizations.
        </Paragraph>

        <Title level={2}>Cookies</Title>

        <Paragraph>
          Like many other websites, this website uses computer cookies to help the website keep track of your preferences, authenticaiton, etc.
        </Paragraph>
      </Typography>
    </Page>
  );
}

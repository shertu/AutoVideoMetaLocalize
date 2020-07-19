import { LeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, Form, Row, Select, message, Alert } from 'antd';
import { Store } from 'antd/lib/form/interface';
import * as React from 'react';
import { Channel, SupportedLanguage } from '../../../../generated-sources/openapi';
import { Page } from '../../Page/Page';
import { VideoFormSelectionTable } from './VideoFormSelectionTable/VideoFormSelectionTable';
import { ServiceFormInput } from '../ServiceFormInput';
import LanguageContext from '../../LanguageContext/LanguageContext';

const FORM_ITEM_NAMES = {
  LANGUAGE_SELECTION: 'language-selection',
  VIDEO_SELECTION: 'video-selection',
  SMB_CHECKBOX: 'smb-checkbox',
};

/**
 * The language and video selection screen and content.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ChannelTranslationConfigurationForm(props: {
  channel?: Channel,
  onFinishForm?: (configuration: ServiceFormInput) => void,
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}): JSX.Element {
  const { channel, onFinishForm, onBack } = props;

  const LANGUAGE_CONTEXT = React.useContext(LanguageContext);
  const googleTranslateSupportedLanguages = LANGUAGE_CONTEXT.CloudTranslation;
  const youTubeI18nLanguages = LANGUAGE_CONTEXT.YouTube;

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  function onFinish(values: Store) {
    const LANGUAGE_SELECTION: string[] = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION];
    const VIDEO_SELECTION: string[] = values[FORM_ITEM_NAMES.VIDEO_SELECTION];
    const SMB_CHECKBOX: boolean = values[FORM_ITEM_NAMES.SMB_CHECKBOX];

    if (onFinishForm) {
      onFinishForm({
        languages: LANGUAGE_SELECTION,
        videos: VIDEO_SELECTION,
        sheetmusicboss: SMB_CHECKBOX,
      });
    }
  }

  let filteredGoogleTranslateSupportedLanguages: SupportedLanguage[] = [];
  if (googleTranslateSupportedLanguages && youTubeI18nLanguages) {
    const youTubeI18nLanguageCodes = youTubeI18nLanguages.map(x => x.hl);
    filteredGoogleTranslateSupportedLanguages = googleTranslateSupportedLanguages.filter(x => youTubeI18nLanguageCodes.includes(x.languageCode));
  }

  const languageSelectOptions = filteredGoogleTranslateSupportedLanguages.map(x =>
    <Select.Option key={x.languageCode} value={x.languageCode} label={x.displayName}>
      {x.displayName}
    </Select.Option >
  );

  return (
    <Page title="Options">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Languages"
          name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
          rules={[{ required: true, message: 'Please select at least one language.' }]}
        >
          <Select
            loading={!languageSelectOptions}
            mode="multiple"
            optionFilterProp="label"
          >
            {languageSelectOptions}
          </Select>
        </Form.Item>

        <div>
          {!googleTranslateSupportedLanguages.length &&
            <Alert
              message="Language Error"
              description="No Cloud Translate languages were found."
              type="error"
              closable
            />
          }

          {!youTubeI18nLanguages.length &&
            <Alert
              message="Language Error"
              description="No YouTube languages were found."
              type="error"
              closable
            />
          }
        </div>

        <Form.Item
          label="Videos"
          name={FORM_ITEM_NAMES.VIDEO_SELECTION}
          rules={[{
            required: true,
            message: 'Please select at least one video.',
          }]}
        >
          <VideoFormSelectionTable
            channel={channel}
          />
        </Form.Item>

        <Collapse className="ant-form-item">
          <Collapse.Panel header="Advanced Options" key="1">
            <Form.Item
              name={FORM_ITEM_NAMES.SMB_CHECKBOX}
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Sheet Music Boss</Checkbox>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>

        <Row align="middle" justify="space-between" gutter={8}>
          <Col>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={onBack}
              style={{ width: '1em' }}
            />
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">Execute</Button>
          </Col>
        </Row>
      </Form>
    </Page>
  );
}

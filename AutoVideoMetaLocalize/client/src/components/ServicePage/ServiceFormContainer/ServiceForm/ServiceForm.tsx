import { LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Col, Collapse, Form, Row, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';
import * as React from 'react';
import { Channel, I18nLanguageSnippet, SupportedLanguage } from '../../../../../generated-sources/openapi';
import { AppVideoLocalizeRequest } from '../../../../../generated-sources/openapi/models/AppVideoLocalizeRequest';
import { YouTubeVideoFormSelectionTable } from './YouTubeVideoFormSelectionTable/YouTubeVideoFormSelectionTable';

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
export function ServiceForm(props: {
  channel?: Channel,
  onFinishForm?: (configuration: AppVideoLocalizeRequest) => void,
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  cloudTranslationSupportedLanguages?: SupportedLanguage[],
  youTubeI18nLanguages?: I18nLanguageSnippet[],
}): JSX.Element {
  const { channel, onFinishForm, onBack } = props;
  const cloudTranslationSupportedLanguages = props.cloudTranslationSupportedLanguages || [];
  const youTubeI18nLanguages = props.youTubeI18nLanguages || [];

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
        sheetMusicBoss: SMB_CHECKBOX,
      });
    }
  }

  // CALCULATE languages options
  const youTubeI18nLanguageCodes = youTubeI18nLanguages.map(x => x.hl);
  const languagesUnion: SupportedLanguage[] = cloudTranslationSupportedLanguages.filter(x => youTubeI18nLanguageCodes.includes(x.languageCode));
  const languageSelectOptions = languagesUnion.map(x =>
    <Select.Option key={x.languageCode} value={x.languageCode} label={x.displayName}>
      {x.displayName}
    </Select.Option >
  );

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={onFinish}
    >
      <Row align="top" justify="center">
        {!cloudTranslationSupportedLanguages.length &&
          <Alert message="Error" description="Failed to load Could Translation languages with this Google account." type="error" showIcon />
        }

        {!youTubeI18nLanguages.length &&
          <Alert message="Error" description="Failed to load YouTube languages with this Google account." type="error" showIcon />
        }
      </Row>

      <Form.Item
        label="Languages"
        name={FORM_ITEM_NAMES.LANGUAGE_SELECTION}
        rules={[{ required: true, message: 'Please select at least one language.' }]}
      >
        <Select
          mode="multiple"
          optionFilterProp="label"
        >
          {languageSelectOptions}
        </Select>
      </Form.Item>

      <Form.Item
        label="Videos"
        name={FORM_ITEM_NAMES.VIDEO_SELECTION}
        rules={[{
          required: true,
          message: 'Please select at least one video.',
        }]}
      >
        <YouTubeVideoFormSelectionTable
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
  );
}

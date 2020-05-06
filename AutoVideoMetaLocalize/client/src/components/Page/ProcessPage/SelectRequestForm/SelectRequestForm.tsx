import * as React from 'react';
import './style.less';
import { Store } from 'antd/lib/form/interface';
import { Channel, AppSupportedLanguage, ApiYouTubeVideoTranslatePostRequest, PlaylistItem } from '../../../../../generated-sources/openapi';
import { Form, Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import StepsStateContext from '../StepsStateContext/StepsStateContext';
import { LanguageSelect } from './LanguageSelect/LanguageSelect';
import { PlaylistItemTable } from './PlaylistItemTable/PlaylistItemTable';

const FORM_ITEM_NAMES = {
  LANGUAGE_SELECTION: 'language-selection',
  VIDEO_SELECTION: 'video-selection',
};

/**
 * The content for the step where the user is selecting options for the AVML process.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function SelectRequestForm(props: {
  channel: Channel,
  setRequestStateAction: React.Dispatch<React.SetStateAction<ApiYouTubeVideoTranslatePostRequest>>,
}): JSX.Element {
  const stepsState = React.useContext(StepsStateContext);
  const [form] = Form.useForm();

  /**
   * 
   * 
   * @param selectedRowKeys
   * @param selectedRows
   */
  async function onChangeRowSelectionPlaylistItemTable(selectedRowKeys: React.Key[], selectedRows: PlaylistItem[]) {
    console.log("TEST", selectedRowKeys, selectedRows);

    form.setFieldsValue({
      [FORM_ITEM_NAMES.VIDEO_SELECTION]: ['abc_id_fake_id']
    });
  }

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {Store} values
   */
  async function onFinish(values: Store): Promise<void> {
    console.log(values);

    //const selectedLanguages: AppSupportedLanguage[] = values[FORM_ITEM_NAMES.LANGUAGE_SELECTION];
    //const selectedVideos: string[] = values[FORM_ITEM_NAMES.VIDEO_SELECTION];

    //props.setRequest({
    //  languages: selectedLanguages.map((_) => _.code),
    //  videoId: selectedVideos.join(','),
    //});
  }

  /**
   *  Called when the back button is clicked.
   */
  async function onClickBackButton() {
    stepsState.setValue(stepsState.value - 1);
  }

  return (
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
        <LanguageSelect />
      </Form.Item>

      <Form.Item
        label="Videos"
        name={FORM_ITEM_NAMES.VIDEO_SELECTION}
        rules={[{
          required: true,
          message: 'Please select at least one video.',
        }]}
      >
        <PlaylistItemTable
          playlistId={props.channel.contentDetails?.relatedPlaylists.uploads}
          onChangeRowSelection={onChangeRowSelectionPlaylistItemTable}
        />
      </Form.Item>

      <Row align="middle" justify="space-between" gutter={8}>
        <Col>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={onClickBackButton}
            style={{ width: '1em' }}
          />
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">Continue</Button>
        </Col>
      </Row>
    </Form>
  );
}

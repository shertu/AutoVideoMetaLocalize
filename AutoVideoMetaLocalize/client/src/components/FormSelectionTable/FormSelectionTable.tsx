import {Table} from 'antd';
import {TableProps} from 'antd/lib/table';
import {TableRowSelection, TablePaginationConfig, SorterResult, TableCurrentDataSource} from 'antd/lib/table/interface';
import * as React from 'react';

export interface FormSelectionTableProps<RecordType extends object = any> extends Omit<TableProps<RecordType>, 'onChange'> {
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
  onChangeTable?: (pagination: TablePaginationConfig, filters: Record<string, React.Key[] | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
}

/**
 * A row selection table to be used in a form item.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function FormSelectionTable<RecordType extends object = any>(props: FormSelectionTableProps<RecordType>): JSX.Element {
  const TABLE_PROPS: TableProps<RecordType> = { ...props, onChange: props.onChangeTable };
  const ROW_SELECTION: TableRowSelection<RecordType> = TABLE_PROPS.rowSelection || {};

  ROW_SELECTION.selectedRowKeys = props.value;
  ROW_SELECTION.onChange = props.onChange;

  TABLE_PROPS.rowSelection = ROW_SELECTION;

  return (<Table {...TABLE_PROPS} />);
}

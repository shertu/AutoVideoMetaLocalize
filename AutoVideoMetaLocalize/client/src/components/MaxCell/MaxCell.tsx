import classNames from 'classnames';
import * as React from 'react';

export declare type MaxCellSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;

export interface MaxCellProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  size?: MaxCellSize,
}

/**
 * A large, full-width view component to display a section of content.
 *
 * @param {MaxCellProps} props
 * @return {JSX.Element}
 */
export function MaxCell(props: MaxCellProps): JSX.Element {
  const {className, size, ...other} = props;

  const maxCellSize: MaxCellSize = size || 'lg';
  const maxCellClassName: string = `max-cell-${maxCellSize}`;

  return (
    <section {...other} className={classNames(maxCellClassName, className)} />
  );
};

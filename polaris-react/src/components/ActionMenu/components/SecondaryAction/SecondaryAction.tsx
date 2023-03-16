import React, {forwardRef, useEffect, useRef} from 'react';

import {classNames} from '../../../../utilities/css';
import {Tooltip} from '../../../Tooltip';
import {Button} from '../../../Button';
import type {ButtonProps} from '../../../Button';

import styles from './SecondaryAction.scss';

interface SecondaryAction extends ButtonProps {
  helpText?: React.ReactNode;
  onAction?(): void;
  getOffsetWidth?(width: number): void;
}

export const SecondaryAction = forwardRef(function SecondaryAction(
  {
    children,
    destructive,
    helpText,
    onAction,
    getOffsetWidth,
    ...rest
  }: SecondaryAction,
  ref,
) {
  const secondaryActionsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!getOffsetWidth || !secondaryActionsRef.current) return;

    getOffsetWidth(secondaryActionsRef.current?.offsetWidth);
  }, [getOffsetWidth]);

  const buttonMarkup = (
    <Button onClick={onAction} {...rest} ref={ref}>
      {children}
    </Button>
  );

  const actionMarkup = helpText ? (
    <Tooltip content={helpText}>{buttonMarkup}</Tooltip>
  ) : (
    buttonMarkup
  );

  return (
    <span
      className={classNames(
        styles.SecondaryAction,
        destructive && styles.destructive,
      )}
      ref={secondaryActionsRef}
    >
      {actionMarkup}
    </span>
  );
});

import React from 'react';

import {ActionList} from '../../../ActionList';
import type {ActionListProps} from '../../../ActionList';
import {Popover} from '../../../Popover';

import {Message} from './components';
import type {MessageProps} from './components';
import styles from './Menu.scss';
import {Box} from '../../../Box';

const USER_MENU_POPOVER_WIDTH = '360px';

export interface MenuProps {
  /** Accepts an activator component that renders inside of a button that opens the menu */
  activatorContent: React.ReactNode;
  /** An array of action objects that are rendered inside of a popover triggered by this menu */
  actions: ActionListProps['sections'];
  /** Accepts a message that facilitates direct, urgent communication with the merchant through the menu */
  message?: MessageProps;
  /** A boolean property indicating whether the menu is currently open */
  open: boolean;
  /** A callback function to handle opening the menu popover */
  onOpen(): void;
  /** A callback function to handle closing the menu popover */
  onClose(): void;
  /** A callback function to handle closing the menu popover */
  onClose(): void;
  /** A string that provides the accessibility labeling */
  accessibilityLabel?: string;
}

export function Menu(props: MenuProps) {
  const {
    actions,
    onOpen,
    onClose,
    open,
    activatorContent,
    message,
    accessibilityLabel,
  } = props;

  const badgeProps = message &&
    message.badge && {
      content: message.badge.content,
      status: message.badge.status,
    };

  const messageMarkup = message && (
    <Message
      title={message.title}
      description={message.description}
      action={{
        onClick: message.action.onClick,
        content: message.action.content,
      }}
      link={{to: message.link.to, content: message.link.content}}
      badge={badgeProps}
    />
  );

  return (
    <Popover
      activator={
        <div className={styles.ActivatorWrapper}>
          <button
            type="button"
            className={styles.Activator}
            onClick={onOpen}
            aria-label={accessibilityLabel}
          >
            {activatorContent}
          </button>
        </div>
      }
      active={open}
      onClose={onClose}
      fixed
      preferredAlignment="right"
    >
      <Box width={USER_MENU_POPOVER_WIDTH}>
        <ActionList onActionAnyItem={onClose} sections={actions} />
        {messageMarkup}
      </Box>
    </Popover>
  );
}

import type {TokenGroup} from './tokens';

/**
 * This file contains legacy design tokens that have not yet been categorized
 * and organized into files. The goal is to eventually remove this file by
 * categorizing tokens by group, moving them into separate files, and/or
 * deprecating any undesired tokens.
 */
export const legacyTokens: TokenGroup = {
  'override-loading-z-index': '514',
  'choice-size': '20px',
  'icon-size': '10px',
  'choice-margin': '1px',
  'control-border-width': '2px',
  'banner-border-default':
    'inset 0 1px 0 0 var(--p-border-neutral-subdued), inset 0 0 0 1px var(--p-border-neutral-subdued)',
  'banner-border-success':
    'inset 0 1px 0 0 var(--p-border-success-subdued), inset 0 0 0 1px var(--p-border-success-subdued)',
  'banner-border-highlight':
    'inset 0 1px 0 0 var(--p-border-highlight-subdued), inset 0 0 0 1px var(--p-border-highlight-subdued)',
  'banner-border-warning':
    'inset 0 1px 0 0 var(--p-border-warning-subdued), inset 0 0 0 1px var(--p-border-warning-subdued)',
  'banner-border-critical':
    'inset 0 1px 0 0 var(--p-border-critical-subdued), inset 0 0 0 1px var(--p-border-critical-subdued)',
  'thin-border-subdued': '1px solid var(--p-border-subdued)',
  'text-field-spinner-offset': '2px',
  'text-field-focus-ring-offset': '-4px',
  'button-group-item-spacing': '-1px',
  'range-slider-thumb-size-base': '16px',
  'range-slider-thumb-size-active': '24px',
  'frame-offset': '0px',
};

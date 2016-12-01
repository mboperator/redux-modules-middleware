import { v4 } from 'uuid';

export propCheck from './propCheck';

export const decorateMeta = func => ({ meta, ...action }) =>
  ({ meta: func(meta), ...action });

export const decoratePayload = func => ({ payload, ...action }) =>
  ({ payload: func(payload), ...action });

const defaultFormatter = ({ type, ...action }) =>
  `${type} | payload: ${action.payload} meta: ${action.meta} errors: ${action.errors}`;

export const log = ({ formatter = defaultFormatter, logFunction = console.log }) =>
  action => {
    logFunction(formatter(action));
    return action;
  };

export const swapTypes = typesToSwap => ({ type, ...action }) =>
  ({ type: typesToSwap[type] || type, ...action });

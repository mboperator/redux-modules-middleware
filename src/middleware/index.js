import { v4 } from 'uuid';

export propCheck from './propCheck';

export const decoratePayload = func => ({ payload, ...action }) =>
  ({ payload: func(payload), ...action });

export const decorateMeta = func => ({ meta, ...action }) =>
  ({ meta: func(meta), ...action });

const defaultErrorChecker = payload => (payload instanceof Error);

export const parsePayloadErrors = (checkForError = defaultErrorChecker) =>
  ({ payload, ...action }) => ({
    ...action,
    error: checkForError(payload),
  });

const defaultFormatter = (type, action) =>
  `${type} | payload: ${action.payload} meta: ${action.meta} errors: ${action.errors}`

export const log = (formatter = defaultFormatter) =>
  ({ type, ...action }) => {
    console.log(formatter(type, action));
    return action;
  };

export const addUUID = (key = 'uuid') => action => ({
  [key]: v4(),
  ...action,
});

export const swapTypes = typesToSwap => ({ type, ...action }) =>
  ({ type: typesToSwap[type] || type, ...action });

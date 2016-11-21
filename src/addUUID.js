import { v4 } from 'uuid';

export const addUUID = (key = 'uuid') => action => ({
  [key]: v4(),
  ...action,
});

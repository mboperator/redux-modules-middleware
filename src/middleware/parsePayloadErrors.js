const defaultErrorChecker = payload => (payload instanceof Error);

export default const parsePayloadErrors = (checkForError = defaultErrorChecker) =>
  ({ payload, ...action }) => ({
    ...action,
    error: checkForError(payload),
  });

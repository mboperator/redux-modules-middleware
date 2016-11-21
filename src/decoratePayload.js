export default decoratePayload = func => ({ payload, ...action }) =>
  ({ payload: func(payload), ...action });

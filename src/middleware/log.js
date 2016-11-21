const defaultFormatter = (type, action) =>
  `${type} | payload: ${action.payload} meta: ${action.meta} errors: ${action.errors}`

export default const log = (formatter = defaultFormatter) =>
  ({ type, ...action }) => {
    console.log(formatter(type, action));
    return action;
  };

export default const decorateMeta = func => ({ meta, ...action }) =>
  ({ meta: func(meta), ...action });

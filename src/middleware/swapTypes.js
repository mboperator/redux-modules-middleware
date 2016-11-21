export default const swapTypes = typesToSwap => ({ type, ...action }) =>
  ({ type: typesToSwap[type] || type, ...action });

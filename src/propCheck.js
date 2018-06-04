import Proptypes from 'prop-types';

const defaultFormatter = (type, err) =>
  `Warning: '${type}' failed payload typecheck: ${err}`;


function propCheck(payloadTypes, params = {}) {
  return ({ payload, type, ...action }) => {
    const {
      logFunction = console.warn,
      formatter = defaultFormatter,
    } = params;

    if (process.env.NODE_ENV === 'production') {
      return {
        payload,
        type,
        ...action,
      };
    }

    if (!payloadTypes) {
      return {
        payload,
        type,
        ...action,
      };
    }


    if (typeof Proptypes.checkPropTypes === 'function') {  // new api
      Proptypes.checkPropTypes(payloadTypes, payload, 'prop', type)
    } else if (typeof payloadTypes === 'function') { // If payloadTypes is a propcheck function
      const result = payloadTypes({ payload }, 'payload', type, 'prop') || {};
      const { message } = result;
      if (message) {
        logFunction(formatter(type, message));
      }
    } else { // If payloadTypes is an object (old API)
      const keys = Object.keys(payloadTypes);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const propChecker = payloadTypes[key];
        if (typeof propChecker !== 'undefined') {
          const { message } = propChecker(payload, key, type, 'prop') || {};
          if (message) {
            logFunction(formatter(type, message));
          }
        }
      }
    }

    return {
      payload,
      type,
      ...action,
    };
  };
}

export default propCheck;

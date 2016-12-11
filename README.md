# redux-modules-middleware [![npm version](https://badge.fury.io/js/redux-modules-middleware.svg)](https://badge.fury.io/js/redux-modules-middleware)

`redux-modules-middleware` is a library that contains commonly used action creator middleware intended for use with the [`redux-modules`](https://github.com/procore/redux-modules) library.

## Getting Started
### Install
`npm install redux-modules-middleware --save`

## Documentation

### `decorateMeta` func -> action -> decoratedAction
Decorates the action's `meta` key with the given function.
```js
    foo: {
      middleware: [
        decorateMeta(meta => 'meta is now a string!'),
      ],
      reducer: (state, { meta }) => {
        console.log(meta); // 'meta is now a string!'
        return state;
      }
    },
```

### `decoratePayload` func -> action -> decoratedAction
Decorates the action's `payload` key with the given function.
```js
    foo: {
      middleware: [
        decoratePayload(payload => 'payload is now a string!'),
      ],
      reducer: (state, { payload }) => {
        console.log(payload); // 'payload is now a string!'
        return state;
      }
    },
```

### `log` ({ formatter, logFunction }) -> action -> action
Runs action through `formatter` function, then calls the `logFunction`.
```js
    foo: {
      middleware: [
        log({
          formatter: action => [
          'thar be an action yonder',
          action
        ]}),
      ],
    },
    // logs `thar be an action yonder { type: foo }`
```
`formatter` should return an array of arguments to be applied to the `logFunction`.

### `swapTypes` object -> action -> decoratedAction
Takes an object where keys are the types to swap, and values are the types to swap them with.
```js
    foo: {
      middleware: [
        swapTypes({ foo: 'bar' }),
      ],
    },
    // action type becomes `bar`
```

### `propCheck` (propFunction or object, { logFunction, formatter }) -> action -> action
Takes either a proptype function, or an object where keys are the payload keys, and values are the corresponding proptype functions.
```js
    create: {
      middleware: [
        propCheck({ name: PropTypes.string }),
      ],
    },
    deleteById: {
      middleware: [
        propCheck(PropTypes.number),
      ],
    },
```

## Usage Example
In this example propCheck and decoratePayload middleware are being used.

#### src/modules/todos.js
```js
import { createModule } from 'redux-modules';
import { propCheck, decoratePayload } from 'redux-modules-middleware';
import { fromJS, List } from 'immutable';
import uuid from 'uuid';
import { PropTypes } from 'react';
const  { shape, string, number } = PropTypes;

export default createModule({
  name: 'todos',
  initialState: List(),
  selector: state => ({ todos: state.get('todos') }),
  transformations: {
    create: {
      middleware: [
        decoratePayload(payload => ({...payload, id: uuid.v4()})),
        propCheck(shape({ description: string.isRequired, id: string.isRequired })),
      ],
      reducer: (state, { payload }) =>
        state.update('collection', todos => todos.push(fromJS(payload))),
    },
    destroy: {
      middleware: [
        propCheck(number.isRequired),
      ],
      reducer: (state, { payload }) => {
        state.update('collection', todos => todos.delete(payload)),
    },
  },
});
```

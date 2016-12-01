# redux-modules [![npm version](https://badge.fury.io/js/redux-modules.svg)](https://badge.fury.io/js/redux-modules) [![npm](https://img.shields.io/npm/dt/redux-modules.svg?maxAge=2592000)](https://www.npmjs.com/package/redux-modules) [![Circle CI](https://circleci.com/gh/procore/redux-modules/tree/master.svg?style=svg)](https://circleci.com/gh/procore/redux-modules/tree/master)

`redux-modules` is a refinement on the [Redux module](https://github.com/erikras/ducks-modular-redux) concept with developer experience in mind. It provides:
- An **intuitive** way to define actions and state transformations
- The ability transform actions before they reach the reducer via middleware
- A decorator that handles the mapState and mapDispatch functions
- A modified Redux Provider that dynamically registers new reducers as connected components are mounted

## Getting Started
### Install
`npm install redux-modules --save`

### Usage Example
Here's an example of a simple todo app. First create a module that allows todos to be created and destroyed.

#### src/modules/todos.js
```js
import { createModule, middleware } from 'redux-modules';
import { fromJS, List } from 'immutable';

import { PropTypes } from 'react';
const  { shape, string, number } = PropTypes;

export default createModule({
  name: 'todos',
  initialState: List(),
  selector: state => ({ todos: state.get('todos') }),
  transformations: {
    create: {
      middleware: [
        middleware.propCheck(
          shape({ description: string.isRequired })
        ),
      ],
      reducer: (state, { payload }) =>
        state.update('collection', todos => todos.push(fromJS(payload))),
    },
    destroy: {
      middleware: [
        middleware.propCheck(number.isRequired),
      ],
      reducer: (state, { payload }) => {
        state.update('collection', todos => todos.delete(payload)),
    },
  },
});
```

Once the module is complete, the reducer has to be added to the store.
#### src/App.jsx
```js
const store = createStore(todoModule.reducer, {});

export default const App = props => (
  <Provider store={store}>
    <Todos {...props}/>
  </Provider>
)
```

Alternatively, use `ModuleProvider` to allow reducers to be automatically added to the store at runtime.

```js
import { ModuleProvider } from 'redux-modules';
const store = createStore(state => state, {});

export default const App = props => (
  <ModuleProvider store={store}>
    <Todos {...props}/>
  </ModuleProvider>
)

```

The last step is to connect the module to the view. This works like a normal Redux `connect` with the added bonus of auto dispatching and namespacing actions.

#### src/views/Todos.jsx
```js
import { connectModule } from 'redux-modules';
import { Component, PropTypes } from 'react';
const  { array, func, shape } = PropTypes;

@connectModule(todoModule)
export default class Todos extends Component {
  static propTypes = {
    todos: array,
    actions: shape({
      create: func,
      destroy: func,
    }),
  };
```

That's it! Check the documentation for comparisons with idiomatic Redux, in depth examples, and advanced usage.

# Documentation
- [Motivation](https://mboperator.gitbooks.io/redux-modules/content/docs/motivation.html)
- [Basic Concepts](https://mboperator.gitbooks.io/redux-modules/content/docs/basics/)
- Recipes
- [API Reference](https://mboperator.gitbooks.io/redux-modules/content/docs/api_reference/REAMDE.html)
- [Tooling](https://mboperator.gitbooks.io/redux-modules/content/docs/tooling/REAMDE.html)

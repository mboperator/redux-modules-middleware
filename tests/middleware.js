import PropTypes from 'prop-types';
import {
  decorateMeta,
  decoratePayload,
  swapTypes,
  log,
  propCheck,
} from '../src';
import { it, describe } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon'

describe('decorateMeta', () => {
  it('should modify action\'s meta property', () => {
    const action = {
      meta: { modified: false, foo: 'bar' },
    };

    const testFunc = meta => ({ ...meta, modified: true });

    expect(decorateMeta(testFunc)(action)).to.deep.equal({
      meta: { modified: true, foo: 'bar' },
    });
  });
  it('should not modify action\'s other properties', () => {
    const action = {
      type: 'NOOP',
      payload: {},
      meta: { modified: false, foo: 'bar' },
    };

    const testFunc = meta => ({ ...meta, modified: true });

    expect(decorateMeta(testFunc)(action)).to.deep.equal({
      type: 'NOOP',
      payload: {},
      meta: { modified: true, foo: 'bar' },
    });
  });
});

describe('decoratePayload', () => {
  it('should modify action\'s payload property', () => {
    const action = {
      payload: { modified: false, foo: 'bar' },
    };

    const testFunc = payload => ({ ...payload, modified: true });

    expect(decoratePayload(testFunc)(action)).to.deep.equal({
      payload: { modified: true, foo: 'bar' },
    });
  });
  it('should not modify action\'s other properties', () => {
    const action = {
      type: 'NOOP',
      payload: { modified: false, foo: 'bar' },
      meta: {},
    };

    const testFunc = payload => ({ ...payload, modified: true });

    expect(decoratePayload(testFunc)(action)).to.deep.equal({
      type: 'NOOP',
      payload: { modified: true, foo: 'bar' },
      meta: {},
    });
  });
});

describe('swapTypes', () => {
  it('should swap the action type', () => {
    const action = { type: 'foo', payload: {} };
    const swap = { foo: 'bar' };

    expect(swapTypes(swap)(action)).to.deep.equal({
      type: 'bar',
      payload: {},
    });
  });
});

describe('log', () => {
  it('should console log the type and action', () => {
    const action = { type: 'foo' };
    let loggedMessage = '';

    const formatter = action => [JSON.stringify(action)];
    const logFunction = message => { loggedMessage = message; };
    log({ logFunction, formatter })(action);

    expect(loggedMessage).to.equal(JSON.stringify(action));
  });
});

describe('propCheck', () => {
  beforeEach(() => {
    sinon.stub(console, 'error');
  });
  
  afterEach(() => {
    console.error.restore();
  });

  it('should not modify the action', () => {
    const action = { type: 'foo', payload: 'bar' };
    const propChecker = propCheck(PropTypes.string);
    expect(propChecker(action)).to.deep.equal(action);
  });
  it('should trigger console.error for mismatched payload types', () => {
    const action = { type: 'foo', payload: { test: 0 } };
    const propChecker = propCheck({ test: PropTypes.string });
    propChecker(action);
    sinon.assert.callCount(console.error, 1);
  });
  it('should not trigger console.error for matched payload types', () => {
    const action = { type: 'foo', payload: { test: 'dfg' } };
    const propChecker = propCheck({ test: PropTypes.string });
    propChecker(action);
    sinon.assert.notCalled(console.error);
  });
});

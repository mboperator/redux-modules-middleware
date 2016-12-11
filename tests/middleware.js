import { PropTypes } from 'react';
import {
  decorateMeta,
  decoratePayload,
  swapTypes,
  log,
  propCheck,
} from '../src';
import { it, describe } from 'mocha';
import { expect } from 'chai';

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
  it('should not modify the action', () => {
    const action = { type: 'foo', payload: 'bar' };
    const propChecker = propCheck(PropTypes.string);
    expect(propChecker(action)).to.deep.equal(action);
  });
  it('should throw prop errors for mismatched payload types', () => {
    const action = { type: 'foo', payload: 0 };
    let errorMessage = '';

    const logFunction = message => { errorMessage = message; };
    const propChecker = propCheck(PropTypes.string, { logFunction });
    propChecker(action);

    expect(errorMessage).to.deep.equal('Warning: \'foo\' failed payload typecheck: Invalid prop `payload` of type `number` supplied to `foo`, expected `string`.');
  });
});

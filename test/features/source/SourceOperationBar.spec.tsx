import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Status } from '../../../src/constants/Status';
import { SourceOperationBar } from '../../../src/features/source/SourceOperationBar';
import * as sourceSlice from '../../../src/features/source/sourceSlice';

function setup(
  preloadedState: {
    source: Partial<sourceSlice.State>;
  } = {
    source: {},
  }
) {
  const initialSourceState = {
    list: [],
    activeId: undefined,
    fetchListStatus: Status.Idle,
    syncListStatus: Status.Idle,
    subscribeLink: '',
    subscribeName: '',
    subscribeStep: undefined,
    subscribeStatus: Status.Idle,
    subscribeError: undefined,
  };
  const state: {
    source: sourceSlice.State;
  } = {
    source: { ...initialSourceState, ...preloadedState.source },
  };
  const store = configureStore({
    reducer: { source: sourceSlice.sourceReducer },
    preloadedState: state,
  });

  render(
    <Provider store={store}>
      <SourceOperationBar />
    </Provider>
  );

  return {
    store,
  };
}

describe('SourceOperationBar component', () => {
  it('should match snapshot when list is empty', () => {
    setup();

    expect(screen.getByRole('toolbar')).toMatchSnapshot();
  });
});

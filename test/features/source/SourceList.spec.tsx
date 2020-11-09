import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { channel } from '../../../app/channel/child';
import { Status } from '../../../app/constants/Status';
import { SourceList } from '../../../app/features/source/SourceList';
import * as sourceSlice from '../../../app/features/source/sourceSlice';
import { mockStore } from '../../test-tools/mockStore';

jest.mock('../../../app/channel/child');
const mockChannel = (channel as unknown) as jest.Mocked<typeof channel>;

function setup(
  preloadedState: {
    source: sourceSlice.State;
  } = {
    source: {
      list: [],
      activeId: null,
      fetchListStatus: Status.Idle,
      subscribeLink: '',
      subscribeName: '',
      subscribeStep: null,
      subscribeStatus: Status.Idle,
      subscribeError: null,
    },
  }
) {
  const store = configureStore({
    reducer: { source: sourceSlice.sourceReducer },
    preloadedState,
  });

  const wrapper = render(
    <Provider store={store}>
      <Router>
        <SourceList bottom={<div />} />
      </Router>
    </Provider>
  );

  return {
    store,
    wrapper,
  };
}

describe('Source component', () => {
  it('should match exact snapshot', () => {
    const { wrapper } = setup();

    expect(wrapper.baseElement).toMatchSnapshot();
  });
});

describe('Test source actions', () => {
  it('should handle searchUrlForSource', async () => {
    const store = mockStore();
    mockChannel.checkUrl.mockResolvedValue('name');
    await store.dispatch(sourceSlice.searchUrlForSource('fake-link'));

    expect(
      store.getActions().map((x) => {
        if (x.meta) {
          x.meta.requestId = 'fake-request-id';
        }
        return x;
      })
    ).toMatchSnapshot();
  });
});

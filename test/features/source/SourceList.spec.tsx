import { configureStore } from '@reduxjs/toolkit';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import 'regenerator-runtime/runtime';
import { channel } from '../../../app/channel/child';
import { Status } from '../../../app/constants/Status';
import { SourceList } from '../../../app/features/source/SourceList';
import * as sourceSlice from '../../../app/features/source/sourceSlice';
import { mockStore } from '../../test-tools/mockStore';

jest.mock('../../../app/channel/child');
const mockChannel = (channel as unknown) as jest.Mocked<typeof channel>;

Enzyme.configure({ adapter: new Adapter() });

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

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router>
          <SourceList bottom={<div />} />
        </Router>
      </Provider>
    );
  const component = getWrapper();
  return {
    store,
    component,
    buttons: component.find('IconContainer'),
  };
}

describe('Source component', () => {
  it('should match exact snapshot', () => {
    const { store } = setup();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <SourceList bottom={<div />} />
          </Router>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('Test source actions', () => {
  it('should handle searchUrlForSource', async () => {
    const store = mockStore();
    mockChannel.checkUrl.mockResolvedValue('name');
    await store.dispatch(sourceSlice.searchUrlForSource('fake-link'));

    expect(store.getActions()).toMatchSnapshot();
  });
});

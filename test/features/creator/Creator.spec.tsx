import { configureStore } from '@reduxjs/toolkit';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import 'regenerator-runtime/runtime';
import { channel } from '../../../app/channel/child';
import { Step } from '../../../app/components/SideBar/BottomBar';
import { Mode } from '../../../app/constants/Mode';
import { Creator } from '../../../app/features/creator/Creator';
import * as creatorSlice from '../../../app/features/creator/creatorSlice';
import { sourceReducer } from '../../../app/features/source/sourceSlice';
import { mockStore } from '../../test-tools/mockStore';

jest.mock('../../../app/channel/child');
const mockChannel = (channel as unknown) as jest.Mocked<typeof channel>;

Enzyme.configure({ adapter: new Adapter() });

function setup(
  preloadedState: {
    creator: {
      link: string;
      name: string;
      step: Step | null;
      loading: boolean;
      parseError: boolean;
    };
    source: {
      refreshing: boolean;
    };
  } = {
    creator: {
      step: null,
      link: '',
      name: '',
      loading: false,
      parseError: false,
    },
    source: {
      refreshing: false,
    },
  }
) {
  const store = configureStore({
    reducer: { creator: creatorSlice.creatorReducer, source: sourceReducer },
    preloadedState,
  });

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router>
          <Creator />
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

describe('Creator component', () => {
  it('should match exact snapshot', () => {
    const { store } = setup();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router>
            <Creator />
          </Router>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should plus button call increment', () => {
    const { buttons } = setup();
    const stepToEnterUrlSpy = jest.spyOn(creatorSlice, 'stepToEnterUrl');

    buttons.at(0).simulate('keydown');
    expect(stepToEnterUrlSpy).toBeCalled();
    stepToEnterUrlSpy.mockRestore();
  });
});

describe('Test creator actions', () => {
  it('should call searchUrl', async () => {
    const store = mockStore();
    mockChannel.checkUrl.mockResolvedValue('name');
    await store.dispatch(creatorSlice.searchUrl('fake-link'));

    expect(store.getActions()).toMatchSnapshot();
  });

  describe('should call confirmName', () => {
    it('should filter icon', async () => {
      const store = mockStore();
      mockChannel.confirm.mockResolvedValue({
        name: 'fake-name',
        sourceUrl: 'fake-url',
        posts: Array(20).fill(0),
        icon: null,
        link: 'fake-link',
        id: 20,
      });
      await store.dispatch(creatorSlice.confirmName('fake-name'));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should set count by mode', async () => {
      const store = mockStore({
        mode: Mode.Starred,
      });
      mockChannel.confirm.mockResolvedValue({
        name: 'fake-name',
        sourceUrl: 'fake-url',
        posts: Array(20).fill(0),
        icon: 'fake-icon',
        link: 'fake-link',
        id: 20,
      });
      await store.dispatch(creatorSlice.confirmName('fake-name'));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});

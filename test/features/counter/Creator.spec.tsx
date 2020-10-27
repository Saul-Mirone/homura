/* eslint react/jsx-props-no-spreading: off, import/first: off, import/order: off */
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
import { Creator } from '../../../app/features/creator/Creator';
import * as creatorSlice from '../../../app/features/creator/creatorSlice';

jest.mock('../../../app/channel/child');

Enzyme.configure({ adapter: new Adapter() });

function setup(
  preloadedState: {
    creator: {
      link: string;
      name: string;
      step: Step | null;
    };
  } = { creator: { link: '', name: '', step: null } }
) {
  const store = configureStore({
    reducer: { creator: creatorSlice.creatorReducer },
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

    buttons.at(0).simulate('click');
    expect(stepToEnterUrlSpy).toBeCalled();
    stepToEnterUrlSpy.mockRestore();
  });
});

describe('Test creator actions', () => {
  it('should call searchUrl', async () => {
    (channel.checkUrl as any).mockResolvedValue('name');
    const fn: any = creatorSlice.searchUrl();
    expect(fn).toBeInstanceOf(Function);
    const dispatch = jest.fn();
    await fn(dispatch, () => ({ creator: { link: 'fake-link' } }));
    expect(dispatch).toBeCalledTimes(2);
  });
});

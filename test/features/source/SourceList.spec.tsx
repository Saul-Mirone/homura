import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Preset } from '../../../app/constants/Preset';
import { Status } from '../../../app/constants/Status';
import { SourceList } from '../../../app/features/source/SourceList';
import * as sourceSlice from '../../../app/features/source/sourceSlice';

const mockAppend = jest.fn();
const mockPopup = jest.fn();

jest.mock('electron', () => {
  return {
    remote: {
      Menu: jest.fn(() => {
        return {
          append: mockAppend,
          popup: mockPopup,
        };
      }),
      MenuItem: jest.fn(({ label, click }) => {
        return {
          label,
          click,
        };
      }),
    },
  };
});

function setup(
  preloadedState: {
    source: Partial<sourceSlice.State>;
  } = {
    source: {},
  }
) {
  const initialSourceState = {
    list: [],
    activeId: null,
    fetchListStatus: Status.Idle,
    subscribeLink: '',
    subscribeName: '',
    subscribeStep: null,
    subscribeStatus: Status.Idle,
    subscribeError: null,
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

describe('SourceList component', () => {
  it('should match snapshot when list is empty', () => {
    const { wrapper } = setup();

    expect(wrapper.baseElement).toMatchSnapshot();
  });

  it('should match snapshot when list is not empty', () => {
    const { wrapper } = setup({
      source: {
        list: [
          {
            id: 1,
            name: 'data-1',
            count: 24,
            icon: null,
            link: 'link-1',
          },
          {
            id: 2,
            name: 'data-2',
            count: 0,
            icon: 'fake-icon-url',
            link: 'link-2',
          },
        ],
        activeId: 2,
        fetchListStatus: Status.Succeeded,
      },
    });

    expect(wrapper.baseElement).toMatchSnapshot();
  });

  it('should call setCurrentSource when click on item', async () => {
    const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
    const { wrapper } = setup({
      source: {
        list: [
          {
            id: 1,
            name: 'data-1',
            count: 24,
            icon: null,
            link: 'link-1',
          },
          {
            id: 2,
            name: 'data-2',
            count: 0,
            icon: 'fake-icon-url',
            link: 'link-2',
          },
        ],
        activeId: 2,
        fetchListStatus: Status.Succeeded,
      },
    });

    const item = await wrapper.getByTestId('source-list-item-1');

    fireEvent.click(item);

    expect(setCurrentSourceSpy).toBeCalledWith(1);
    expect(item).toHaveClass('bg-gray-600');

    const presetAll = await wrapper.getByTestId('source-list-preset-all');

    fireEvent.click(presetAll);
    expect(setCurrentSourceSpy).toBeCalledWith(Preset.All);
  });

  it('should create context menu when click right button on item', async () => {
    const menu: Array<{ label: string; click: () => void }> = [];
    mockAppend.mockImplementation((x) => menu.push(x));

    const unsubscribeSpy = jest.spyOn(sourceSlice, 'unsubscribeById');
    const updateSourceByIdSpy = jest.spyOn(sourceSlice, 'updateSourceById');

    const { wrapper } = setup({
      source: {
        list: [
          {
            id: 1,
            name: 'data-1',
            count: 24,
            icon: null,
            link: 'link-1',
          },
          {
            id: 2,
            name: 'data-2',
            count: 0,
            icon: 'fake-icon-url',
            link: 'link-2',
          },
        ],
        activeId: 2,
        fetchListStatus: Status.Succeeded,
      },
    });

    const item = await wrapper.getByTestId('source-list-item-1');

    fireEvent.contextMenu(item);

    expect(mockPopup).toBeCalledTimes(1);
    expect(menu.map((x) => x.label)).toEqual(['unsubscribe', 'edit']);

    menu[0].click();
    expect(unsubscribeSpy).toBeCalledWith(1);

    act(() => {
      menu[1].click();
    });

    const input = await wrapper.getByTestId('source-list-item-1:edit-input');
    const button = await wrapper.getByTestId('source-list-item-1:edit-button');

    expect(input).toHaveValue('data-1');

    fireEvent.change(input, { target: { value: 'data-1-new-value' } });
    expect(input).toHaveValue('data-1-new-value');

    fireEvent.mouseDown(button);

    expect(updateSourceByIdSpy).toBeCalledWith({
      id: 1,
      name: 'data-1-new-value',
    });
  });
});

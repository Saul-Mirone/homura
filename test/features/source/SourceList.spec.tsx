import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { Preset } from '../../../src/constants/Preset';
import { Status } from '../../../src/constants/Status';
import { SourceList } from '../../../src/features/source/SourceList';
import * as sourceSlice from '../../../src/features/source/sourceSlice';

const mockAppend = jest.fn();
const mockPopup = jest.fn();

jest.mock('electron', () => ({
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
}));

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

  render(
    <Provider store={store}>
      <SourceList bottom={<div />} />
    </Provider>
  );

  return {
    store,
  };
}

describe('SourceList component', () => {
  it('should match snapshot when list is empty', () => {
    setup();

    const sourceList = screen.getByTestId('source-side-bar');

    expect(sourceList).toMatchSnapshot();
  });

  it('should match snapshot when list is not empty', () => {
    setup({
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
    const sourceList = screen.getByTestId('source-side-bar');

    expect(sourceList).toMatchSnapshot();
  });

  it('should call setCurrentSource when click on item', () => {
    const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
    setup({
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

    const item = screen.getByTestId('source-list-item-1');

    fireEvent.click(item);

    expect(setCurrentSourceSpy).toBeCalledWith(1);
    expect(item).toHaveClass('active');

    const presetAll = screen.getByTestId('source-list-preset-all');

    fireEvent.click(presetAll);
    expect(setCurrentSourceSpy).toBeCalledWith(Preset.All);
  });

  it('should create context menu when click right button on item', () => {
    const menu: Array<{ label: string; click: () => void }> = [];
    mockAppend.mockImplementation((x) => menu.push(x));

    const unsubscribeSpy = jest.spyOn(sourceSlice, 'unsubscribeById');
    const updateSourceByIdSpy = jest.spyOn(sourceSlice, 'updateSourceById');

    setup({
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

    const item = screen.getByTestId('source-list-item-1');

    fireEvent.contextMenu(item);

    expect(mockPopup).toBeCalledTimes(1);
    expect(menu.map((x) => x.label)).toEqual(['unsubscribe', 'edit']);

    menu[0].click();
    expect(unsubscribeSpy).toBeCalledWith(1);

    act(() => {
      menu[1].click();
    });

    const input = screen.getByTestId('source-list-item-1:edit-input');
    const button = screen.getByTestId('source-list-item-1:edit-button');

    expect(input).toHaveValue('data-1');

    userEvent.type(input, '-new-value');
    expect(input).toHaveValue('data-1-new-value');

    fireEvent.mouseDown(button);

    expect(updateSourceByIdSpy).toBeCalledWith({
      id: 1,
      name: 'data-1-new-value',
    });
  });
});

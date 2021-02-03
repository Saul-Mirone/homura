// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, getByRole, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Mode } from '../../../src/constants/Mode';
import { Status } from '../../../src/constants/Status';
import * as modeSlice from '../../../src/features/mode/modeSlice';
import { SourceList } from '../../../src/features/source/SourceList';
import * as sourceSlice from '../../../src/features/source/sourceSlice';
import { Preset } from '../../../src/constants/Preset';
import userEvent from '@testing-library/user-event';

const mockAppend = jest.fn();
const mockPopup = jest.fn();

jest.mock('electron', () => ({
    remote: {
        Menu: jest.fn(() => ({
            append: mockAppend,
            popup: mockPopup,
        })),
        MenuItem: jest.fn(({ label, click }) => ({
            label,
            click,
        })),
    },
}));

function setup(
    preloadedState: {
        source: Partial<sourceSlice.State>;
        mode?: Mode;
    } = {
        source: {},
        mode: Mode.All,
    },
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
        mode: Mode;
    } = {
        source: { ...initialSourceState, ...preloadedState.source },
        mode: preloadedState.mode ?? Mode.All,
    };
    const store = configureStore({
        reducer: { source: sourceSlice.sourceReducer, mode: modeSlice.modeReducer },
        preloadedState: state,
    });

    const utils = render(
        <Provider store={store}>
            <SourceList bottom={<div />} />
        </Provider>,
    );

    return {
        ...utils,
        store,
        list: utils.getByRole('list'),
    };
}

type Menu = {
    label: string;
    click: () => void;
};

test('SourceList', async () => {
    // prepare
    mockChannel.getSourceList.mockResolvedValue([
        {
            id: 1,
            name: 'data-1',
            count: 24,
            link: 'link-1',
        },
        {
            id: 2,
            name: 'data-2',
            count: 0,
            icon: 'fake-icon-url',
            link: 'link-2',
        },
        {
            id: 3,
            name: 'data-3',
            count: 2,
            link: 'link-3',
        },
    ]);
    mockChannel.sync.mockResolvedValue();
    mockChannel.removeSourceById.mockResolvedValue();

    const menu: Array<Menu> = [];
    mockAppend.mockImplementation((x) => menu.push(x));

    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
    const syncSourcesSpy = jest.spyOn(sourceSlice, 'syncSources');
    const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
    const unsubscribeSpy = jest.spyOn(sourceSlice, 'unsubscribeById');
    const updateSourceByIdSpy = jest.spyOn(sourceSlice, 'updateSourceById');

    // setup
    const { getAllByRole, getByTestId, list, container } = setup();

    // first init
    expect(list).toMatchSnapshot();

    const preloadedItems = getAllByRole('button');
    expect(preloadedItems).toHaveLength(2);

    expect(syncSourcesSpy).toBeCalledTimes(1);

    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledTimes(1));

    expect(fetchSourcesSpy).toBeCalledWith(Mode.All);

    const items = getAllByRole('button');
    expect(items).toHaveLength(5);

    expect(list).toMatchSnapshot();

    const data1Item = items[2]!;

    fireEvent.click(data1Item);
    expect(setCurrentSourceSpy).toBeCalledWith(1);
    expect(data1Item).toHaveClass('active');

    expect(container.querySelectorAll('.sidebar-item__count')).toHaveLength(2);
    expect(container.querySelector('.sidebar-item__count')!.innerHTML).toBe('24');

    expect(container.querySelector('.sidebar-overview-item__count')!.innerHTML).toBe('26');

    const presetAll = items[0]!;

    fireEvent.click(presetAll);
    expect(setCurrentSourceSpy).toBeCalledWith(Preset.All);
    expect(data1Item).not.toHaveClass('active');
    expect(presetAll).toHaveClass('active');

    fireEvent.click(list);
    expect(setCurrentSourceSpy).toBeCalledWith();
    expect(presetAll).not.toHaveClass('active');

    const count = setCurrentSourceSpy.mock.calls.length;
    fireEvent.click(list);
    expect(setCurrentSourceSpy).toBeCalledTimes(count);

    fireEvent.contextMenu(data1Item);
    expect(mockPopup).toBeCalledTimes(1);
    expect(menu.map((x) => x.label)).toEqual(['unsubscribe', 'edit']);

    const [unsubscribeMenuButton, editMenuButton] = menu as [Menu, Menu];

    await act(() => unsubscribeMenuButton.click());

    const nextItems = getAllByRole('button');
    expect(nextItems).toHaveLength(4);

    expect(unsubscribeSpy).toBeCalledWith(1);

    // Fixme
    act(() => editMenuButton.click());

    const input = getByTestId('source-list-item-1:edit-input');
    const buttonContainer = getByTestId('source-list-item-1:edit-button');
    const button = getByRole(buttonContainer, 'button');

    expect(input).toHaveValue('data-1');

    userEvent.type(input, '-new-value');
    expect(input).toHaveValue('data-1-new-value');

    fireEvent.click(button);

    expect(updateSourceByIdSpy).toBeCalledWith({
        id: 1,
        name: 'data-1-new-value',
    });
});

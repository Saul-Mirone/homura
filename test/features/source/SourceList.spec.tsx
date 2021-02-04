// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
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
        el: {
            list: utils.getByRole('list'),
            get items() {
                return utils.getAllByRole('listitem');
            },
            get totalCount() {
                return Number(utils.container.querySelector('.sidebar-overview-item__count')!.innerHTML);
            },
        },
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
    mockChannel.updateSourceNameById.mockResolvedValue();

    let menu: Array<Menu> = [];
    mockAppend.mockImplementation((x) => menu.push(x));

    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
    const syncSourcesSpy = jest.spyOn(sourceSlice, 'syncSources');
    const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
    const unsubscribeSpy = jest.spyOn(sourceSlice, 'unsubscribeById');
    const updateSourceByIdSpy = jest.spyOn(sourceSlice, 'updateSourceById');

    // setup
    const { el, container } = setup();

    // first init
    expect(el.list).toMatchSnapshot();

    expect(el.items).toHaveLength(2);

    expect(syncSourcesSpy).toBeCalledTimes(1);

    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledTimes(1));

    expect(fetchSourcesSpy).toBeCalledWith(Mode.All);

    expect(el.items).toHaveLength(5);

    expect(el.list).toMatchSnapshot();

    const data1Item = el.items[2]!;

    fireEvent.click(data1Item);
    expect(setCurrentSourceSpy).toBeCalledWith(1);
    expect(data1Item).toHaveClass('active');

    expect(container.querySelectorAll('.sidebar-item__count')).toHaveLength(2);
    expect(container.querySelector('.sidebar-item__count')!.innerHTML).toBe('24');

    expect(el.totalCount).toBe(26);

    const presetAll = el.items[0]!;

    fireEvent.click(presetAll);
    expect(setCurrentSourceSpy).toBeCalledWith(Preset.All);
    expect(data1Item).not.toHaveClass('active');
    expect(presetAll).toHaveClass('active');

    fireEvent.click(el.list);
    expect(setCurrentSourceSpy).toBeCalledWith();
    expect(presetAll).not.toHaveClass('active');

    const count = setCurrentSourceSpy.mock.calls.length;
    fireEvent.click(el.list);
    expect(setCurrentSourceSpy).toBeCalledTimes(count);

    fireEvent.contextMenu(data1Item);
    expect(mockPopup).toBeCalledTimes(1);
    expect(menu.map((x) => x.label)).toEqual(['unsubscribe', 'edit']);

    await act(() => menu[0]!.click());

    expect(unsubscribeSpy).toBeCalledWith(1);
    expect(el.totalCount).toBe(2);
    expect(el.items).toHaveLength(4);

    menu = [];
    const data2Item = el.items[2]!;
    fireEvent.contextMenu(data2Item);
    act(() => menu[1]!.click());

    const input = container.querySelector('input')!;
    const button = container.querySelector('.sidebar-item__confirm-icon')!;

    expect(input).toHaveValue('data-2');

    userEvent.type(input, '-new-value');
    expect(input).toHaveValue('data-2-new-value');

    fireEvent.click(button);

    await waitFor(() => expect(updateSourceByIdSpy).toHaveBeenCalledTimes(1));
    expect(updateSourceByIdSpy).toBeCalledWith({
        id: 2,
        name: 'data-2-new-value',
    });
    expect(data2Item).toContainHTML('data-2-new-value');
});

/* eslint-disable @typescript-eslint/no-non-null-assertion */

// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Mode } from '../../../src/constants/Mode';
import { Status } from '../../../src/constants/Status';
import { SourceList } from '../../../src/features/source/SourceList';
import * as sourceSlice from '../../../src/features/source/sourceSlice';
import * as modeSlice from '../../../src/features/mode/modeSlice';
import { Preset } from '../../../src/constants/Preset';
import userEvent from '@testing-library/user-event';
import { source } from '../../fixture/source';

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
        fold: false,
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
        switchMode(mode: Mode) {
            store.dispatch(modeSlice.switchMode(mode));
        },
        el: {
            get list() {
                return utils.getByRole('menu');
            },
            get items() {
                return utils.getAllByRole('menuitem');
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

function prepareChannel() {
    mockChannel.getSourceList.mockResolvedValue(source);
    mockChannel.sync.mockResolvedValue();
    mockChannel.removeSourceById.mockResolvedValue();
    mockChannel.updateSourceNameById.mockResolvedValue();
}

function prepareMenu() {
    let menu: Array<Menu> = [];
    let menuBuffer: Array<Menu> = [];
    mockAppend.mockImplementation((x) => menuBuffer.push(x));
    mockPopup.mockImplementation(() => {
        menu = [...menuBuffer];
        menuBuffer = [];
    });

    return () => menu;
}

beforeEach(() => {
    prepareChannel();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('should first render called sync and fetch', async () => {
    const syncSourcesSpy = jest.spyOn(sourceSlice, 'syncSources');
    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');

    const { el } = setup();

    expect(el.list).toMatchSnapshot();
    expect(el.items).toHaveLength(2);
    expect(syncSourcesSpy).toBeCalledTimes(1);

    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledTimes(1));

    expect(fetchSourcesSpy).toBeCalledWith(Mode.All);
    expect(el.items).toHaveLength(5);
    expect(el.list).toMatchSnapshot();

    expect(el.totalCount).toBe(26);
});

test('should render presets work', async () => {
    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
    const { el, switchMode } = setup();

    switchMode(Mode.Unread);
    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledWith(Mode.Unread));
    expect(el.items).toHaveLength(3);
    expect(el.list).toMatchSnapshot();

    switchMode(Mode.Starred);
    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledWith(Mode.Starred));
    expect(el.items).toHaveLength(3);
    expect(el.list).toMatchSnapshot();
});

test('should click on items work', async () => {
    const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
    const { el, container } = setup();

    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledTimes(1));

    const data1Item = el.items[2]!;

    fireEvent.click(data1Item);
    expect(setCurrentSourceSpy).toBeCalledWith(1);
    expect(data1Item).toHaveClass('active');

    expect(container.querySelectorAll('.sidebar-item__count')).toHaveLength(2);
    expect(container.querySelector('.sidebar-item__count')!.innerHTML).toBe('24');

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
});

test('should context menu work', async () => {
    const updateSourceByIdSpy = jest.spyOn(sourceSlice, 'updateSourceById');
    const unsubscribeSpy = jest.spyOn(sourceSlice, 'unsubscribeById');
    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
    const getMenu = prepareMenu();
    const { el, container } = setup();

    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledTimes(1));

    const data1Item = el.items[2]!;

    fireEvent.contextMenu(data1Item);
    expect(mockPopup).toBeCalledTimes(1);
    expect(getMenu().map((x) => x.label)).toEqual(['unsubscribe', 'edit']);

    await act(() => getMenu()[0]!.click());

    expect(unsubscribeSpy).toBeCalledWith(1);
    expect(el.list).toMatchSnapshot();
    expect(el.totalCount).toBe(2);
    expect(el.items).toHaveLength(4);

    // context menu > edit
    const data2Item = el.items[2]!;
    fireEvent.contextMenu(data2Item);
    act(() => getMenu()[1]!.click());

    let input = container.querySelector('input')!;

    expect(input).toHaveValue('data-2');

    userEvent.type(input, '-new-value');
    expect(input).toHaveValue('data-2-new-value');

    fireEvent.blur(input);
    expect(data2Item).not.toContainHTML('data-2-new-value');

    fireEvent.contextMenu(data2Item);
    act(() => getMenu()[1]!.click());

    input = container.querySelector('input')!;

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
    expect(el.list).toMatchSnapshot();
});

test('should fold match snapshot', async () => {
    const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
    const { el } = setup({ source: { fold: true } });

    await waitFor(() => expect(fetchSourcesSpy).toHaveBeenCalledTimes(1));

    expect(el.list).toMatchSnapshot();
});

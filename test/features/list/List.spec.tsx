// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Status } from '../../../src/constants/Status';
import { List } from '../../../src/features/list/List';
import * as listSlice from '../../../src/features/list/listSlice';
import * as sourceSlice from '../../../src/features/source/sourceSlice';
import { post } from '../../fixture/post';
import { Mode } from '../../../src/constants/Mode';
import { modeReducer } from '../../../src/features/mode/modeSlice';
import { Preset } from '../../../src/constants/Preset';
import { source } from '../../fixture/source';

function setup(
    preloadedState: {
        list: Partial<listSlice.State>;
        source: Partial<sourceSlice.State>;
        mode: Mode;
    } = {
        list: {},
        source: {},
        mode: Mode.All,
    },
) {
    const initialListState = {
        posts: [],
        activeId: undefined,
        filter: '',
    };
    const initialSourceState = {
        list: source,
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
        list: listSlice.State;
        source: sourceSlice.State;
        mode: Mode;
    } = {
        list: { ...initialListState, ...preloadedState.list },
        source: { ...initialSourceState, ...preloadedState.source },
        mode: preloadedState.mode ?? Mode.All,
    };
    const store = configureStore({
        reducer: { list: listSlice.listReducer, source: sourceSlice.sourceReducer, mode: modeReducer },
        preloadedState: state,
    });

    const utils = render(
        <Provider store={store}>
            <List header={<div />} />
        </Provider>,
    );

    return {
        ...utils,
        store,
        setActiveId: (id: number) => store.dispatch(listSlice.setActiveId(id)),
        setActiveSourceId: (id: number | Preset) => store.dispatch(sourceSlice.setCurrentSource(id)),
        el: {
            get sidebar() {
                return utils.getByRole('presentation');
            },
            get items() {
                return utils.getAllByRole('menuitemradio');
            },
            get readAllButton() {
                return utils.getByLabelText('Mark all as read');
            },
        },
    };
}

function prepareChannel() {
    mockChannel.getSourceById.mockResolvedValue(post);
    mockChannel.getPostByPreset.mockResolvedValue(post);
    mockChannel.setPostUnread.mockResolvedValue(undefined!);
    mockChannel.markAllAsReadBySourceId.mockResolvedValue(undefined!);
}

beforeEach(() => {
    prepareChannel();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('List item', async () => {
    const getListBySourceIdSpy = jest.spyOn(listSlice, 'getListBySourceId');
    const getListByPresetSpy = jest.spyOn(listSlice, 'getListByPreset');
    const markAsUnreadSpy = jest.spyOn(listSlice, 'markAsUnread');
    const setActiveIdSpy = jest.spyOn(listSlice, 'setActiveId');
    const decCountByIdSpy = jest.spyOn(sourceSlice, 'decCountById');

    const { el, getByRole, getByText, setActiveSourceId } = setup();

    expect(el.sidebar).toMatchSnapshot();

    setActiveSourceId(1);

    await waitFor(() => expect(getListBySourceIdSpy).toBeCalledWith({ id: 1, mode: Mode.All }));

    let title1 = getByText('test-title-1');
    let title2 = getByText('test-title-2');

    expect(title1.className).not.toContain('text-gray-600');
    expect(title2.className).not.toContain('text-gray-600');

    fireEvent.click(el.items[1]!);

    await waitFor(() => expect(markAsUnreadSpy).toBeCalledWith({ id: 2, unread: false }));

    expect(getByRole('menuitemradio', { checked: true })).toBe(el.items[1]);
    expect(decCountByIdSpy).toBeCalledWith(1);

    title2 = getByText('test-title-2');
    expect(title2.className).toContain('text-gray-600');

    fireEvent.click(el.items[0]!);

    title1 = getByText('test-title-1');
    expect(title1.className).not.toContain('text-gray-600');
    expect(decCountByIdSpy).not.toBeCalledWith(0);

    fireEvent.click(el.sidebar);
    expect(setActiveIdSpy).toBeCalledWith();

    setActiveSourceId(Preset.Starred);
    await waitFor(() => expect(getListByPresetSpy).toBeCalledWith(Preset.Starred));
});

test('Mark all as read for single id', () => {
    const markAsReadSpy = jest.spyOn(listSlice, 'markAsRead');
    const clearCountByIdSpy = jest.spyOn(sourceSlice, 'clearCountById');

    const { el, setActiveSourceId } = setup();

    fireEvent.click(el.readAllButton);
    expect(markAsReadSpy).not.toBeCalled();

    setActiveSourceId(1);
    fireEvent.click(el.readAllButton);
    expect(markAsReadSpy).toBeCalledWith(1);
    expect(clearCountByIdSpy).toBeCalledWith(1);

    setActiveSourceId(Preset.Starred);
});

test('Mark all as read for preset', () => {
    const markAsReadSpy = jest.spyOn(listSlice, 'markAsRead');
    const clearCountByIdSpy = jest.spyOn(sourceSlice, 'clearCountById');

    const { el, setActiveSourceId } = setup();

    setActiveSourceId(Preset.Starred);

    fireEvent.click(el.readAllButton);
    expect(markAsReadSpy).not.toBeCalled();

    setActiveSourceId(Preset.Unread);

    fireEvent.click(el.readAllButton);
    expect(markAsReadSpy).toBeCalledWith([1, 2, 3]);
    expect(clearCountByIdSpy).toBeCalledTimes(3);
});

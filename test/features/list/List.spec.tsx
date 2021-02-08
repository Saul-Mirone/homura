// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Status } from '../../../src/constants/Status';
import { List } from '../../../src/features/list/List';
import * as listSlice from '../../../src/features/list/listSlice';
import * as sourceSlice from '../../../src/features/source/sourceSlice';
import { post } from '../../fixture/post';

function setup(
    preloadedState: {
        list: Partial<listSlice.State>;
        source: Partial<sourceSlice.State>;
    } = {
        list: {},
        source: {},
    },
) {
    const initialListState = {
        posts: post,
        activeId: undefined,
        filter: '',
    };
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
        list: listSlice.State;
        source: sourceSlice.State;
    } = {
        list: { ...initialListState, ...preloadedState.list },
        source: { ...initialSourceState, ...preloadedState.source },
    };
    const store = configureStore({
        reducer: { list: listSlice.listReducer, source: sourceSlice.sourceReducer },
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
        el: {},
    };
}

function prepareChannel() {
    mockChannel.getSourceById.mockResolvedValue(post);
}

beforeEach(() => {
    prepareChannel();
});

test('List items', () => {
    setup();
});

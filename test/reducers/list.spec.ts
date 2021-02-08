/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnyAction } from 'redux';

// organize-imports-ignore
import { mockChannel } from '../test-tools/mockChannel';

import {
    getListByPreset,
    getListBySourceId,
    listReducer,
    markAsRead,
    markAsStarred,
    markAsUnread,
    reset,
    setActiveId,
    setFilter,
} from '../../src/features/list/listSlice';
import { post } from '../fixture/post';
import { mockStore } from '../test-tools/mockStore';
import { formatActions } from '../test-tools/formatActions';
import { Mode } from '../../src/constants/Mode';
import { Preset } from '../../src/constants/Preset';

test('should handle initial state', () => {
    expect(listReducer(undefined, {} as AnyAction)).toMatchSnapshot();
});

test('should handle reset', () => {
    expect(
        listReducer(
            {
                posts: post,
                activeId: 1,
                filter: 'filter',
            },
            {
                type: reset,
            },
        ),
    ).toMatchSnapshot();
});

test('should handle setActiveId', () => {
    expect(
        listReducer(undefined, {
            type: setActiveId,
            payload: 1,
        }),
    ).toMatchSnapshot();
});

test('should handle setFilter', () => {
    expect(
        listReducer(undefined, {
            type: setFilter,
            payload: 'filter',
        }),
    ).toMatchSnapshot();
});

describe('getListBySourceId', () => {
    it('should action list match snapshot', async () => {
        const store = mockStore();
        mockChannel.getSourceById.mockResolvedValue(post);
        await store.dispatch(getListBySourceId({ id: 5, mode: Mode.All }));

        expect(formatActions(store)).toMatchSnapshot();
    });

    it('should handle fulfilled', () => {
        expect(
            listReducer(undefined, {
                type: getListBySourceId.fulfilled,
                payload: post,
            }),
        ).toMatchSnapshot();
    });
});

describe('getListByPreset', () => {
    it('should action list match snapshot', async () => {
        const store = mockStore();
        mockChannel.getPostByPreset.mockResolvedValue(post);
        await store.dispatch(getListByPreset(Preset.Unread));

        expect(formatActions(store)).toMatchSnapshot();
    });

    it('should handle fulfilled', () => {
        expect(
            listReducer(undefined, {
                type: getListByPreset.fulfilled,
                payload: post,
            }),
        ).toMatchSnapshot();
    });
});

describe('markAsUnread', () => {
    it('should action list match snapshot', async () => {
        const store = mockStore();
        mockChannel.setPostUnread.mockResolvedValue(undefined!);
        await store.dispatch(markAsUnread({ id: 1, unread: true }));

        expect(formatActions(store)).toMatchSnapshot();
    });

    it('should handle fulfilled', () => {
        expect(
            listReducer(
                {
                    posts: post,
                    filter: '',
                    activeId: 1,
                },
                {
                    type: markAsUnread.fulfilled,
                    payload: {
                        id: 1,
                        unread: true,
                    },
                },
            ),
        ).toMatchSnapshot();
    });
});

describe('markAsStarred', () => {
    it('should action list match snapshot', async () => {
        const store = mockStore();
        mockChannel.setPostStarred.mockResolvedValue(undefined!);
        await store.dispatch(markAsStarred({ id: 1, starred: false }));

        expect(formatActions(store)).toMatchSnapshot();
    });

    it('should handle fulfilled', () => {
        expect(
            listReducer(
                {
                    posts: post,
                    filter: '',
                    activeId: 1,
                },
                {
                    type: markAsStarred.fulfilled,
                    payload: {
                        id: 1,
                        starred: false,
                    },
                },
            ),
        ).toMatchSnapshot();
    });
});

describe('markAsRead', () => {
    it('should number payload action list match snapshot', async () => {
        const store = mockStore();
        mockChannel.markAllAsReadBySourceId.mockResolvedValue(undefined!);
        await store.dispatch(markAsRead(1));

        expect(formatActions(store)).toMatchSnapshot();
    });

    it('should array payload action list match snapshot', async () => {
        const store = mockStore();
        mockChannel.markAllAsReadBySourceId.mockResolvedValue(undefined!);
        await store.dispatch(markAsRead([1, 2]));

        expect(formatActions(store)).toMatchSnapshot();
    });

    it('should handle fulfilled', () => {
        expect(
            listReducer(
                {
                    posts: post,
                    filter: '',
                    activeId: 1,
                },
                {
                    type: markAsRead.fulfilled,
                },
            ),
        ).toMatchSnapshot();
    });
});

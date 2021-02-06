import { configureStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import * as listSlice from '../../../src/features/list/listSlice';
import { Post } from '../../../src/features/post/Post';
import * as postSlice from '../../../src/features/post/postSlice';
import { mockChannel } from '../../test-tools/mockChannel';

function setup(
    preloadedState: {
        list: Partial<listSlice.State>;
        post: postSlice.State;
    } = {
        list: {},
        post: {
            content: '',
        },
    },
) {
    const initialListState = {
        posts: [
            {
                id: 1,
                sourceId: 0,
                title: 'test-title-1',
                unread: false,
                starred: true,
                link: 'test-link-1',
                date: 'test-date-1',
                icon: 'test-icon-1',
                sourceName: 'test-source-name-1',
            },
            {
                id: 2,
                sourceId: 1,
                title: 'test-title-2',
                unread: true,
                starred: false,
                link: 'test-link-2',
                date: 'test-date-2',
                icon: 'test-icon-2',
                sourceName: 'test-source-name-2',
            },
        ],
        activeId: undefined,
        filter: '',
    };
    const state: {
        list: listSlice.State;
        post: postSlice.State;
    } = {
        list: { ...initialListState, ...preloadedState.list },
        post: preloadedState.post,
    };
    const store = configureStore({
        reducer: { list: listSlice.listReducer, post: postSlice.postReducer },
        preloadedState: state,
    });

    const utils = render(
        <Provider store={store}>
            <Post />
        </Provider>,
    );

    return {
        ...utils,
        store,
        setActiveId: (id: number) => store.dispatch(listSlice.setActiveId(id)),
        el: {
            get post() {
                return utils.getByRole('article');
            },
        },
    };
}

test('Post', async () => {
    const mockScrollTo = jest.fn();
    HTMLElement.prototype.scrollTo = mockScrollTo;

    const getPostContentByIdSpy = jest.spyOn(postSlice, 'getPostContentById');

    const { el, setActiveId, getByAltText } = setup();

    expect(getByAltText('homura')).toHaveAttribute('src');
    expect(el.post).toMatchSnapshot();

    mockChannel.getPostById.mockResolvedValue({ content: 'fake-content' } as any);

    setActiveId(1);

    await waitFor(() => expect(getPostContentByIdSpy).toBeCalledWith(1));

    expect(mockScrollTo).toBeCalledWith(0, 0);

    expect(el.post).toMatchSnapshot();
});

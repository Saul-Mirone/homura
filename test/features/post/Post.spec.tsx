import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import * as listSlice from '../../../src/features/list/listSlice';
import { Post } from '../../../src/features/post/Post';
import * as postSlice from '../../../src/features/post/postSlice';

jest.mock('../../../src/components/Reader', () => {
    const FakeReader = ({ toolkit }: { toolkit: JSX.Element }) => toolkit;
    return { Reader: FakeReader };
});

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
        posts: [],
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

    const rendered = render(
        <Provider store={store}>
            <Post />
        </Provider>,
    );

    return {
        store,
        rendered,
    };
}

describe('Post component', () => {
    it('should match snapshot when no post', () => {
        const { rendered } = setup();

        expect(rendered.container.firstChild).toBeNull();
    });

    it('should match snapshot when target not exist', () => {
        const { rendered } = setup({
            list: {
                activeId: 20,
                posts: [
                    {
                        id: 1,
                        sourceId: 0,
                        title: 'test-title',
                        unread: false,
                        starred: true,
                        link: 'test-link',
                        date: 'test-date',
                        icon: 'test-icon',
                        sourceName: 'test-source-name',
                    },
                ],
            },
            post: {
                content: 'test-content',
            },
        });

        expect(rendered.container.firstChild).toBeNull();
    });

    it('should match snapshot when has post', () => {
        const { rendered } = setup({
            list: {
                activeId: 1,
                posts: [
                    {
                        id: 1,
                        sourceId: 0,
                        title: 'test-title',
                        unread: false,
                        starred: true,
                        link: 'test-link',
                        date: 'test-date',
                        icon: 'test-icon',
                        sourceName: 'test-source-name',
                    },
                ],
            },
            post: {
                content: 'test-content',
            },
        });

        expect(rendered.container.firstChild).toMatchSnapshot();
    });
});

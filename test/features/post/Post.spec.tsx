/* eslint-disable @typescript-eslint/no-explicit-any */

// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import * as listSlice from '../../../src/features/list/listSlice';
import { Post } from '../../../src/features/post/Post';
import * as postSlice from '../../../src/features/post/postSlice';
import * as modeSlice from '../../../src/features/mode/modeSlice';
import { Mode } from '../../../src/constants/Mode';
import { post } from '../../fixture/post';

function setup(
    preloadedState: {
        list: Partial<listSlice.State>;
        post: postSlice.State;
        mode: Mode;
    } = {
        list: {},
        post: {
            content: '',
        },
        mode: Mode.All,
    },
) {
    const initialListState = {
        posts: post,
        activeId: undefined,
        filter: '',
    };
    const state: {
        list: listSlice.State;
        post: postSlice.State;
        mode: Mode;
    } = {
        list: { ...initialListState, ...preloadedState.list },
        post: preloadedState.post,
        mode: preloadedState.mode,
    };
    const store = configureStore({
        reducer: { list: listSlice.listReducer, post: postSlice.postReducer, mode: modeSlice.modeReducer },
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
        setMode: (mode: Mode) => store.dispatch(modeSlice.switchMode(mode)),
        el: {
            get post() {
                return utils.getByRole('article');
            },
            get toolkit() {
                return utils.getByRole('group');
            },
            get starButton() {
                return utils.getByLabelText('Mark as starred');
            },
            get unreadButton() {
                return utils.getByLabelText('Mark as unread');
            },
            get shareButton() {
                return utils.getByLabelText('Open in browser');
            },
        },
    };
}

test('Post', async () => {
    const mockScrollTo = jest.fn();
    HTMLElement.prototype.scrollTo = mockScrollTo;

    const mockOpen = jest.fn();
    global.open = mockOpen;

    mockChannel.setPostStarred.mockResolvedValue(undefined as any);
    mockChannel.setPostUnread.mockResolvedValue(undefined as any);
    mockChannel.getPostById.mockResolvedValue({ content: 'fake-content' } as any);

    const getPostContentByIdSpy = jest.spyOn(postSlice, 'getPostContentById');
    const markAsStarredSpy = jest.spyOn(listSlice, 'markAsStarred');
    const markActiveUnreadAsSpy = jest.spyOn(listSlice, 'markAsUnread');

    const { el, setActiveId, getByAltText } = setup();

    expect(getByAltText('homura')).toHaveAttribute('src');
    expect(el.post).toMatchSnapshot();

    setActiveId(20);
    expect(el.post).toMatchSnapshot();

    setActiveId(1);

    await waitFor(() => expect(getPostContentByIdSpy).toBeCalledWith(1));

    expect(mockScrollTo).toBeCalledWith(0, 0);

    expect(el.post).toMatchSnapshot();

    fireEvent.click(el.starButton);
    await waitFor(() => expect(markAsStarredSpy).toBeCalledTimes(1));
    expect(mockChannel.setPostStarred).toBeCalledWith(1, false);

    fireEvent.click(el.unreadButton);
    await waitFor(() => expect(markActiveUnreadAsSpy).toBeCalledTimes(1));
    expect(mockChannel.setPostUnread).toBeCalledWith(1, true);

    fireEvent.click(el.shareButton);
    expect(mockOpen).toBeCalledWith('test-link-1');
});

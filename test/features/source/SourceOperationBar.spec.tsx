/* eslint-disable @typescript-eslint/no-non-null-assertion */

// organize-imports-ignore
// make sure mock file on the top of imports
import { mockChannel } from '../../test-tools/mockChannel';

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Mode } from '../../../src/constants/Mode';
import { Status } from '../../../src/constants/Status';
import * as modeSlice from '../../../src/features/mode/modeSlice';
import { SourceOperationBar } from '../../../src/features/source/SourceOperationBar';
import * as sourceSlice from '../../../src/features/source/sourceSlice';
import userEvent from '@testing-library/user-event';

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
            <SourceOperationBar />
        </Provider>,
    );

    return {
        ...utils,
        store,
        el: {
            get bar() {
                return utils.getByRole('toolbar');
            },
            get addButton() {
                return utils.getByLabelText('Add a source');
            },
            get syncButton() {
                return utils.getByLabelText('Sync sources');
            },
            get urlInput() {
                return utils.getByLabelText('Feed search input');
            },
            get urlSearchButton() {
                return utils.getByLabelText('Search URL');
            },
            get alert() {
                return utils.getByRole('alert');
            },
            get closeAlertButton() {
                return utils.getByLabelText('Close alert');
            },
            get nameInput() {
                return utils.getByLabelText('Subscribed name input');
            },
            get confirmButton() {
                return utils.getByLabelText('Confirm subscribe');
            },
            get foldButton() {
                return utils.getByLabelText('Fold source menu');
            },
            get unfoldButton() {
                return utils.getByLabelText('Unfold source menu');
            },
        },
    };
}

test('SourceOperationBar', async () => {
    const subscribeToSourceSpy = jest.spyOn(sourceSlice, 'subscribeToSource');
    const syncSourcesSpy = jest.spyOn(sourceSlice, 'syncSources');
    const resetSubscribeStateSpy = jest.spyOn(sourceSlice, 'resetSubscribeState');

    const { el, queryByRole } = setup();
    expect(el.bar).toMatchSnapshot();

    mockChannel.sync.mockResolvedValue();
    fireEvent.click(el.syncButton);

    await waitFor(() => expect(syncSourcesSpy).toBeCalledTimes(1));

    fireEvent.click(el.addButton);
    expect(el.bar).toMatchSnapshot();

    fireEvent.click(el.addButton);

    expect(el.urlInput).toHaveValue('');
    userEvent.type(el.urlInput, 'cancel value');

    fireEvent.blur(el.urlInput);
    expect(resetSubscribeStateSpy).toBeCalledTimes(1);

    fireEvent.click(el.addButton);

    expect(el.urlInput).toHaveValue('');
    userEvent.type(el.urlInput, 'wrong value');

    mockChannel.checkUrl.mockResolvedValue('');

    fireEvent.click(el.urlSearchButton);

    await waitFor(() => expect(mockChannel.checkUrl).toBeCalledTimes(1));

    expect(mockChannel.checkUrl).toBeCalledWith('wrong value');

    expect(el.alert).not.toBeNull();

    fireEvent.blur(el.urlInput);

    expect(el.alert).not.toBeNull();

    fireEvent.click(el.closeAlertButton);

    expect(queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.click(el.addButton);
    userEvent.type(el.urlInput, ' sub');

    mockChannel.checkUrl.mockResolvedValue('Fake Feed');

    fireEvent.click(el.urlSearchButton);

    await waitFor(() => expect(mockChannel.checkUrl).toBeCalledWith('wrong value sub'));

    expect(queryByRole('alert')).not.toBeInTheDocument();
    expect(el.nameInput).toHaveValue('Fake Feed');

    fireEvent.blur(el.nameInput);
    expect(resetSubscribeStateSpy).toBeCalledTimes(2);

    fireEvent.click(el.addButton);
    userEvent.type(el.urlInput, 'right value');
    fireEvent.click(el.urlSearchButton);

    await waitFor(() => expect(mockChannel.checkUrl).toBeCalledWith('right value'));
    expect(el.nameInput).toHaveValue('Fake Feed');
    userEvent.type(el.nameInput, ' Sub');

    mockChannel.confirm.mockResolvedValue({
        id: 1,
        name: 'fake-name',
        link: 'fake-link',
        count: 10,
    });

    fireEvent.click(el.confirmButton);

    await waitFor(() => expect(mockChannel.confirm).toBeCalledWith('Fake Feed Sub'));

    expect(subscribeToSourceSpy).toBeCalledWith({ mode: Mode.All, name: 'Fake Feed Sub' });
    expect(el.bar).toMatchSnapshot();

    fireEvent.click(el.foldButton);

    expect(el.unfoldButton).not.toBeNull();
    expect(el.bar).toMatchSnapshot();

    fireEvent.click(el.unfoldButton);

    expect(el.foldButton).not.toBeNull();
    expect(el.bar).toMatchSnapshot();
});

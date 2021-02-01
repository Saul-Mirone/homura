import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, getByLabelText, getByRole, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Step } from '../../../src/components/SideBar/BottomBar';
import { Mode } from '../../../src/constants/Mode';
import { Status } from '../../../src/constants/Status';
import * as modeSlice from '../../../src/features/mode/modeSlice';
import { SourceOperationBar } from '../../../src/features/source/SourceOperationBar';
import * as sourceSlice from '../../../src/features/source/sourceSlice';

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

    render(
        <Provider store={store}>
            <SourceOperationBar />
        </Provider>,
    );

    return {
        store,
    };
}

describe('SourceOperationBar component', () => {
    it('should match snapshot when not rendered', () => {
        setup();

        expect(screen.getByRole('toolbar')).toMatchSnapshot();
    });

    it('should match snapshot enterUrlStep', () => {
        setup({
            source: {
                subscribeStep: Step.EnterUrl,
            },
        });

        expect(screen.getByRole('toolbar')).toMatchSnapshot();
    });

    it('should match snapshot enterNameStep', () => {
        setup({
            source: {
                subscribeStep: Step.EnterName,
            },
        });

        expect(screen.getByRole('toolbar')).toMatchSnapshot();
    });

    it('should click button', () => {
        const subscribeToSourceSpy = jest.spyOn(sourceSlice, 'subscribeToSource');
        setup({
            source: {
                subscribeStep: Step.EnterName,
            },
            mode: Mode.Starred,
        });

        const subscribeContent = screen.getByTestId('sidebar-subscribe-bar-content');
        const input = getByLabelText(subscribeContent, 'subscribed-source-name');
        const button = getByRole(subscribeContent, 'button');
        fireEvent.change(input, { target: { value: 'test name' } });
        fireEvent.click(button);
        expect(subscribeToSourceSpy).toBeCalledWith({ mode: Mode.Starred, name: 'test name' });
    });
});

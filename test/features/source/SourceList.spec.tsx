import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, getByRole, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { Mode } from '../../../src/constants/Mode';
import { Preset } from '../../../src/constants/Preset';
import { Status } from '../../../src/constants/Status';
import * as modeSlice from '../../../src/features/mode/modeSlice';
import { SourceList } from '../../../src/features/source/SourceList';
import * as sourceSlice from '../../../src/features/source/sourceSlice';

const mockAppend = jest.fn();
const mockPopup = jest.fn();

jest.mock('electron', () => ({
    remote: {
        Menu: jest.fn(() => {
            return {
                append: mockAppend,
                popup: mockPopup,
            };
        }),
        MenuItem: jest.fn(({ label, click }) => {
            return {
                label,
                click,
            };
        }),
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

    render(
        <Provider store={store}>
            <SourceList bottom={<div />} />
        </Provider>,
    );

    return {
        store,
    };
}

describe('SourceList component', () => {
    it('should match snapshot when list is empty', () => {
        setup();

        const sourceList = screen.getByTestId('source-side-bar');

        expect(sourceList).toMatchSnapshot();
    });

    it('should match snapshot when list is not empty', () => {
        setup({
            source: {
                list: [
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
                ],
                activeId: 2,
                fetchListStatus: Status.Succeeded,
            },
        });
        const sourceList = screen.getByTestId('source-side-bar');

        expect(sourceList).toMatchSnapshot();
    });

    it('should call setCurrentSource when click on item', () => {
        const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
        setup({
            source: {
                list: [
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
                ],
                activeId: 2,
                fetchListStatus: Status.Succeeded,
            },
        });

        const item = screen.getByTestId('source-list-item-1');

        fireEvent.click(item);

        expect(setCurrentSourceSpy).toBeCalledWith(1);
        expect(item).toHaveClass('active');

        const presetAll = screen.getByTestId('source-list-preset-all');

        fireEvent.click(presetAll);
        expect(setCurrentSourceSpy).toBeCalledWith(Preset.All);
    });

    it('should call fetchSources when sync finished', () => {
        const fetchSourcesSpy = jest.spyOn(sourceSlice, 'fetchSources');
        setup({
            source: {
                list: [
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
                ],
                activeId: 2,
                fetchListStatus: Status.Succeeded,
                syncListStatus: Status.Succeeded,
            },
            mode: Mode.Starred,
        });

        expect(fetchSourcesSpy).toBeCalledWith(Mode.Starred);
    });

    it('should reset setCurrentSource when click on empty area', () => {
        const setCurrentSourceSpy = jest.spyOn(sourceSlice, 'setCurrentSource');
        setup({
            source: {
                list: [
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
                ],
                activeId: 2,
                fetchListStatus: Status.Succeeded,
            },
        });

        const item = screen.getByTestId('source-list-item-1');

        fireEvent.click(item);

        expect(setCurrentSourceSpy).toBeCalledWith(1);
        expect(item).toHaveClass('active');
        const sourceList = screen.getByTestId('source-side-bar');

        fireEvent.click(sourceList);

        expect(setCurrentSourceSpy).toBeCalledWith();
        expect(item).not.toHaveClass('active');

        const count = setCurrentSourceSpy.mock.calls.length;
        fireEvent.click(sourceList);
        expect(setCurrentSourceSpy).toBeCalledTimes(count);
    });

    it('should create context menu when click right button on item', () => {
        const menu: Array<{ label: string; click: () => void }> = [];
        mockAppend.mockImplementation((x) => menu.push(x));

        const unsubscribeSpy = jest.spyOn(sourceSlice, 'unsubscribeById');
        const updateSourceByIdSpy = jest.spyOn(sourceSlice, 'updateSourceById');

        setup({
            source: {
                list: [
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
                ],
                activeId: 2,
                fetchListStatus: Status.Succeeded,
            },
        });

        const item = screen.getByTestId('source-list-item-1');

        fireEvent.contextMenu(item);

        expect(mockPopup).toBeCalledTimes(1);
        expect(menu.map((x) => x.label)).toEqual(['unsubscribe', 'edit']);

        menu[0]?.click();
        expect(unsubscribeSpy).toBeCalledWith(1);

        act(() => {
            menu[1]?.click();
        });

        const input = screen.getByTestId('source-list-item-1:edit-input');
        const buttonContainer = screen.getByTestId('source-list-item-1:edit-button');
        const button = getByRole(buttonContainer, 'button');

        expect(input).toHaveValue('data-1');

        userEvent.type(input, '-new-value');
        expect(input).toHaveValue('data-1-new-value');

        fireEvent.click(button);

        expect(updateSourceByIdSpy).toBeCalledWith({
            id: 1,
            name: 'data-1-new-value',
        });
    });
});

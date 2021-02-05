import React from 'react';
import { useSelector } from 'react-redux';
import { BottomBar, Step } from '../../components/SideBar/BottomBar';
import { FeedSearchBar } from '../../components/SideBar/FeedSearchBar';
import { FeedSubscribeBar } from '../../components/SideBar/FeedSubscribeBar';
import { useActions } from '../../hooks';
import {
    resetSubscribeError,
    resetSubscribeState,
    searchUrlForSource,
    selectSourceOperation,
    showSubscribeBar,
    subscribeToSource,
    syncSources,
} from './sourceSlice';

export const SourceOperationBar: React.FC = () => {
    const { mode, loading, subscribeStep, subscribeName, subscribeLink, subscribeError } = useSelector(
        selectSourceOperation,
    );
    const [
        searchUrlForSourceDispatch,
        resetSubscribeStateDispatch,
        resetSubscribeErrorDispatch,
        subscribeToSourceDispatch,
        showSubscribeBarDispatch,
        syncSourcesDispatch,
    ] = useActions([
        searchUrlForSource,
        resetSubscribeState,
        resetSubscribeError,
        subscribeToSource,
        showSubscribeBar,
        syncSources,
    ]);

    const renderBottom = React.useCallback(
        (currentStep: Step) => {
            switch (currentStep) {
                case Step.EnterUrl: {
                    return (
                        <FeedSearchBar
                            hasError={subscribeError === 'ParseRSSFailed'}
                            loading={loading}
                            onSearch={searchUrlForSourceDispatch}
                            onCancel={resetSubscribeStateDispatch}
                            onClickError={resetSubscribeErrorDispatch}
                        />
                    );
                }
                case Step.EnterName: {
                    return (
                        <FeedSubscribeBar
                            link={subscribeLink}
                            initialName={subscribeName}
                            onCancel={resetSubscribeStateDispatch}
                            onConfirm={(inputName) => {
                                subscribeToSourceDispatch({
                                    name: inputName,
                                    mode,
                                });
                            }}
                        />
                    );
                }
            }
        },
        [
            loading,
            mode,
            resetSubscribeErrorDispatch,
            resetSubscribeStateDispatch,
            searchUrlForSourceDispatch,
            subscribeError,
            subscribeLink,
            subscribeName,
            subscribeToSourceDispatch,
        ],
    );

    return (
        <BottomBar
            step={subscribeStep}
            loading={loading}
            onClickPlus={() => showSubscribeBarDispatch()}
            onClickSync={() => syncSourcesDispatch()}
            render={renderBottom}
        />
    );
};

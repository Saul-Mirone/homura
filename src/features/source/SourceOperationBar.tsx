import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BottomBar, Step } from '../../components/SideBar/BottomBar';
import { FeedSearchBar } from '../../components/SideBar/FeedSearchBar';
import { FeedSubscribeBar } from '../../components/SideBar/FeedSubscribeBar';
import { AppDispatch } from '../../store';
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
    const dispatch = useDispatch<AppDispatch>();
    const { mode, loading, subscribeStep, subscribeName, subscribeLink, subscribeError } = useSelector(
        selectSourceOperation,
    );

    const renderBottom = React.useCallback(
        (currentStep: Step) => {
            switch (currentStep) {
                case Step.EnterUrl: {
                    return (
                        <FeedSearchBar
                            hasError={subscribeError === 'ParseRSSFailed'}
                            loading={loading}
                            onSearch={(inputLink) => dispatch(searchUrlForSource(inputLink))}
                            onCancel={() => dispatch(resetSubscribeState())}
                            onClickError={() => dispatch(resetSubscribeError())}
                        />
                    );
                }
                case Step.EnterName: {
                    return (
                        <FeedSubscribeBar
                            link={subscribeLink}
                            initialName={subscribeName}
                            onCancel={() => dispatch(resetSubscribeState())}
                            onConfirm={(inputName) => {
                                dispatch(
                                    subscribeToSource({
                                        name: inputName,
                                        mode,
                                    }),
                                );
                            }}
                        />
                    );
                }
                default: {
                    throw new Error('Invalid Step');
                }
            }
        },
        [subscribeError, subscribeLink, subscribeName, dispatch, loading, mode],
    );

    return (
        <BottomBar
            step={subscribeStep}
            loading={loading}
            onClickPlus={() => dispatch(showSubscribeBar())}
            onClickSync={() => dispatch(syncSources())}
            render={renderBottom}
        />
    );
};

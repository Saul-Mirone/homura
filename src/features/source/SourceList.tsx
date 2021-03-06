import React from 'react';
import { useSelector } from 'react-redux';
import { SideBar } from '../../components';
import { Header } from '../../components/SideBar/Header';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { Status } from '../../constants/Status';
import { useActions } from '../../hooks';
import {
    fetchSources,
    selectSourceList,
    setCurrentSource,
    syncSources,
    unsubscribeById,
    updateSourceById,
} from './sourceSlice';

export const SourceList: React.FC<{ bottom: JSX.Element }> = ({ bottom }) => {
    const [
        setCurrentSourceDispatch,
        syncSourcesDispatch,
        updateSourceByIdDispatch,
        unsubscribeByIdDispatch,
        fetchSourcesDispatch,
    ] = useActions([setCurrentSource, syncSources, updateSourceById, unsubscribeById, fetchSources]);

    const { list, activeId, mode, totalCount, syncStatus, fold } = useSelector(selectSourceList);

    React.useEffect(() => {
        syncSourcesDispatch();
    }, [syncSourcesDispatch]);

    React.useEffect(() => {
        if (syncStatus === Status.Succeeded) {
            fetchSourcesDispatch(mode);
        }
    }, [fetchSourcesDispatch, mode, syncStatus]);

    const onClickEmptyArea = React.useCallback(() => {
        if (activeId) {
            setCurrentSourceDispatch();
        }
    }, [activeId, setCurrentSourceDispatch]);

    const overview = React.useMemo(
        () => (
            <Header fold={fold} mode={mode} active={activeId} count={totalCount} onClick={setCurrentSourceDispatch} />
        ),
        [activeId, fold, mode, setCurrentSourceDispatch, totalCount],
    );

    const renderList = React.useMemo(
        () =>
            list.map(({ id, name, count, icon }) => (
                <SideBarItem
                    key={id.toString()}
                    fold={fold}
                    url={icon}
                    name={name}
                    count={count}
                    active={id === activeId}
                    onConfirmModify={(nextName) => updateSourceByIdDispatch({ id, name: nextName })}
                    onUnsubscribe={() => unsubscribeByIdDispatch(id)}
                    onClick={() => setCurrentSourceDispatch(id)}
                />
            )),
        [activeId, fold, list, setCurrentSourceDispatch, unsubscribeByIdDispatch, updateSourceByIdDispatch],
    );

    return (
        <SideBar fold={fold} onClick={onClickEmptyArea} overview={overview} bottom={bottom}>
            {renderList}
        </SideBar>
    );
};

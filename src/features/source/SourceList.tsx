import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SideBar } from '../../components/SideBar';
import { Header } from '../../components/SideBar/Header';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { Status } from '../../constants/Status';
import { useActions } from '../../hooks';
import { AppDispatch } from '../../store';
import {
    fetchSources,
    selectSourceList,
    setCurrentSource,
    syncSources,
    unsubscribeById,
    updateSourceById,
} from './sourceSlice';

export const SourceList: React.FC<{ bottom: JSX.Element }> = ({ bottom }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [
        setCurrentSourceDispatch,
        syncSourcesDispatch,
        updateSourceByIdDispatch,
        unsubscribeByIdDispatch,
    ] = useActions([setCurrentSource, syncSources, updateSourceById, unsubscribeById]);

    const { list, activeId, mode, totalCount, syncStatus } = useSelector(selectSourceList);

    React.useEffect(() => {
        syncSourcesDispatch();
    }, [syncSourcesDispatch]);

    React.useEffect(() => {
        if (syncStatus === Status.Succeeded) {
            dispatch(fetchSources(mode));
        }
    }, [dispatch, mode, syncStatus]);

    const onClickEmptyArea = React.useCallback(() => {
        if (activeId) {
            setCurrentSourceDispatch();
        }
    }, [activeId, setCurrentSourceDispatch]);

    const overview = React.useMemo(
        () => <Header mode={mode} active={activeId} count={totalCount} onClick={setCurrentSourceDispatch} />,
        [activeId, mode, setCurrentSourceDispatch, totalCount],
    );

    const renderList = React.useMemo(
        () =>
            list.map(({ id, name, count, icon }) => (
                <SideBarItem
                    key={id.toString()}
                    id={id}
                    url={icon}
                    name={name}
                    count={count}
                    active={id === activeId}
                    onConfirmModify={(nextName) => updateSourceByIdDispatch({ id, name: nextName })}
                    onUnsubscribe={() => unsubscribeByIdDispatch(id)}
                    onClick={() => setCurrentSourceDispatch(id)}
                />
            )),
        [activeId, list, setCurrentSourceDispatch, unsubscribeByIdDispatch, updateSourceByIdDispatch],
    );

    return (
        <SideBar onClick={onClickEmptyArea} overview={overview} bottom={bottom}>
            {renderList}
        </SideBar>
    );
};

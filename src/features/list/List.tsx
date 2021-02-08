import React from 'react';
import { useSelector } from 'react-redux';
import { SubSideBar } from '../../components/SubSideBar';
import { DateItem } from '../../components/SubSideBar/DateItem';
import { PostItem } from '../../components/SubSideBar/PostItem';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import { useActions } from '../../hooks';
import { clearCountById, decCountById } from '../source/sourceSlice';
import {
    getListByPreset,
    getListBySourceId,
    markAsRead,
    markAsUnread,
    reset,
    selectList,
    setActiveId,
    setFilter,
} from './listSlice';

export const List: React.FC<{ header: JSX.Element }> = ({ header }) => {
    const { groups, activeId, activeSourceId, mode, sourceIdList } = useSelector(selectList);

    const [
        resetDispatch,
        setActiveIdDispatch,
        markAsReadDispatch,
        setFilterDispatch,
        getListBySourceIdDispatch,
        getListByPresetDispatch,
        markAsUnreadDispatch,
        clearCountByIdDispatch,
        decCountByIdDispatch,
    ] = useActions([
        reset,
        setActiveId,
        markAsRead,
        setFilter,
        getListBySourceId,
        getListByPreset,
        markAsUnread,
        clearCountById,
        decCountById,
    ]);

    React.useEffect(() => {
        if (!activeSourceId) {
            resetDispatch();
            return;
        }

        setActiveIdDispatch();
        if (typeof activeSourceId === 'number') {
            getListBySourceIdDispatch({
                id: activeSourceId,
                mode,
            });
            return;
        }

        getListByPresetDispatch(activeSourceId);
    }, [activeSourceId, getListByPresetDispatch, getListBySourceIdDispatch, mode, resetDispatch, setActiveIdDispatch]);

    const clickOnEmpty = React.useCallback(() => {
        if (!activeId) return;
        setActiveIdDispatch();
    }, [activeId, setActiveIdDispatch]);

    const onReadAll = React.useCallback(() => {
        if (!activeSourceId) return;

        if (typeof activeSourceId === 'number') {
            markAsReadDispatch(activeSourceId);
            clearCountByIdDispatch(activeSourceId);
            return;
        }

        if ([Preset.Unread, Preset.All].includes(activeSourceId)) {
            markAsReadDispatch(sourceIdList);
            sourceIdList.forEach(clearCountByIdDispatch);
        }
    }, [activeSourceId, clearCountByIdDispatch, markAsReadDispatch, sourceIdList]);

    return (
        <SubSideBar header={header} onClick={clickOnEmpty} onReadAll={onReadAll} onSearch={setFilterDispatch}>
            {groups.map(({ time, posts }) => (
                <DateItem key={time} date={time}>
                    {posts.map(({ id, name, title, icon, unread, starred, sourceId }) => (
                        <PostItem
                            key={id.toString()}
                            active={id === activeId}
                            name={title}
                            source={name}
                            icon={icon === null ? undefined : icon}
                            unread={unread}
                            starred={starred}
                            onClick={() => {
                                if (id === activeId) return;
                                setActiveIdDispatch(id);

                                if (!unread) return;
                                markAsUnreadDispatch({ id, unread: false });

                                if (mode === Mode.Starred) return;
                                decCountByIdDispatch(sourceId);
                            }}
                        />
                    ))}
                </DateItem>
            ))}
        </SubSideBar>
    );
};

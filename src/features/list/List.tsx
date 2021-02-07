import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubSideBar } from '../../components/SubSideBar';
import { DateItem } from '../../components/SubSideBar/DateItem';
import { PostItem } from '../../components/SubSideBar/PostItem';
import { Mode } from '../../constants/Mode';
import { useActions } from '../../hooks';
import { AppDispatch } from '../../store';
import { decCountById } from '../source/sourceSlice';
import {
    getListByPreset,
    getListBySourceId,
    markAllAsRead,
    markAsUnread,
    reset,
    selectList,
    setActiveId,
    setFilter,
} from './listSlice';

export const List: React.FC<{ header: JSX.Element }> = ({ header }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { groups, activeId, activeSourceId, mode } = useSelector(selectList);

    const [
        resetDispatch,
        setActiveIdDispatch,
        markAllAsReadDispatch,
        setFilterDispatch,
        getListBySourceIdDispatch,
        getListByPresetDispatch,
        markAsUnreadDispatch,
    ] = useActions([reset, setActiveId, markAllAsRead, setFilter, getListBySourceId, getListByPreset, markAsUnread]);

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

    return (
        <SubSideBar
            onClick={clickOnEmpty}
            header={header}
            onReadAll={markAllAsReadDispatch}
            onSearch={setFilterDispatch}
        >
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
                                dispatch(decCountById(sourceId));
                            }}
                        />
                    ))}
                </DateItem>
            ))}
        </SubSideBar>
    );
};

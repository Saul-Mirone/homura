import React from 'react';
import { useSelector } from 'react-redux';
import { Reader } from '../../components/Reader';
import { Toolkit } from '../../components/Reader/Toolkit';
import { Mode } from '../../constants/Mode';
import { useActions } from '../../hooks';
import { markAsStarred, markAsUnread } from '../list/listSlice';
import { decCountById, incCountById } from '../source/sourceSlice';
import { getPostContentById, selectPost } from './postSlice';

export const Post: React.FC = () => {
    const { post, activeId, mode } = useSelector(selectPost);
    const [
        getPostContentByIdDispatch,
        markAsUnreadDispatch,
        markAsStarredDispatch,
        decCountByIdDispatch,
        incCountByIdDispatch,
    ] = useActions([getPostContentById, markAsUnread, markAsStarred, decCountById, incCountById]);

    React.useEffect(() => {
        if (!activeId) return;
        getPostContentByIdDispatch(activeId);
    }, [activeId, getPostContentByIdDispatch]);

    const modifyCount = React.useCallback(
        (shouldIncrease: boolean, id: number) => (shouldIncrease ? incCountByIdDispatch(id) : decCountByIdDispatch(id)),
        [decCountByIdDispatch, incCountByIdDispatch],
    );

    const onSwitchStatus = React.useCallback(
        (x: boolean, matchMode: (mode: Mode) => boolean, fn: (id: number, status: boolean) => void) => {
            if (activeId === undefined || mode === undefined || !post) return;

            const status = !x;

            fn(activeId, status);

            if (matchMode(mode)) {
                modifyCount(status, post.sourceId);
            }
        },
        [activeId, mode, modifyCount, post],
    );

    const onSwitchStarred = React.useCallback(
        (x: boolean) => {
            onSwitchStatus(
                x,
                (m) => m === Mode.Starred,
                (id, status) => {
                    markAsStarredDispatch({
                        id,
                        starred: status,
                    });
                },
            );
        },
        [markAsStarredDispatch, onSwitchStatus],
    );

    const onSwitchUnread = React.useCallback(
        (x: boolean) => {
            onSwitchStatus(
                x,
                (m) => m !== Mode.Starred,
                (id, status) => {
                    markAsUnreadDispatch({
                        id,
                        unread: status,
                    });
                },
            );
        },
        [markAsUnreadDispatch, onSwitchStatus],
    );

    const onShare = React.useCallback(() => window.open(post?.link), [post?.link]);

    const toolkit = React.useMemo(
        () =>
            post ? (
                <Toolkit
                    starred={post.starred}
                    unread={post.unread}
                    onSwitchStarred={onSwitchStarred}
                    onSwitchUnread={onSwitchUnread}
                    onShare={onShare}
                />
            ) : null,
        [onShare, onSwitchStarred, onSwitchUnread, post],
    );

    return <Reader post={post} toolkit={toolkit} />;
};

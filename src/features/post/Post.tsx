import React from 'react';
import { useSelector } from 'react-redux';
import { Reader } from '../../components/Reader';
import { Toolkit } from '../../components/Reader/Toolkit';
import { useActions } from '../../hooks';
import { markActiveStarredAs, markActiveUnreadAs } from '../list/listSlice';
import { getPostContentById, selectPost } from './postSlice';

export const Post: React.FC = () => {
    const { post, activeId } = useSelector(selectPost);
    const [getPostContentByIdDispatch, markActiveStarredAsDispatch, markActiveUnreadAsDispatch] = useActions([
        getPostContentById,
        markActiveStarredAs,
        markActiveUnreadAs,
    ]);

    React.useEffect(() => {
        if (!activeId) return;
        getPostContentByIdDispatch(activeId);
    }, [activeId, getPostContentByIdDispatch]);

    const onSwitchStarred = React.useCallback((x: boolean) => markActiveStarredAsDispatch(!x), [
        markActiveStarredAsDispatch,
    ]);
    const onSwitchUnread = React.useCallback((x: boolean) => markActiveUnreadAsDispatch(!x), [
        markActiveUnreadAsDispatch,
    ]);
    const onShare = React.useCallback(() => window.open(post?.link), [post?.link]);

    const toolkit = React.useMemo(
        () =>
            post ? (
                <Toolkit
                    starred={post.starred}
                    onSwitchStarred={onSwitchStarred}
                    unread={post.unread}
                    onSwitchUnread={onSwitchUnread}
                    onShare={onShare}
                />
            ) : null,
        [onShare, onSwitchStarred, onSwitchUnread, post],
    );

    return <Reader post={post} toolkit={toolkit} />;
};

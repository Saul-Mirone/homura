import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Reader } from '../../components/Reader';
import { Toolkit } from '../../components/Reader/Toolkit';
import { AppDispatch } from '../../store';
import { markActiveStarredAs, markActiveUnreadAs } from '../list/listSlice';
import { getPostContentById, selectPost } from './postSlice';

export const Post: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { post, activeId } = useSelector(selectPost);

    React.useEffect(() => {
        if (!activeId) return;
        dispatch(getPostContentById(activeId));
    }, [activeId, dispatch]);

    const toolkit = post ? (
        <Toolkit
            starred={post.starred}
            onSwitchStarred={(x) => dispatch(markActiveStarredAs(!x))}
            unread={post.unread}
            onSwitchUnread={(x) => dispatch(markActiveUnreadAs(!x))}
            onShare={() => window.open(post.link)}
        />
    ) : null;

    return <Reader post={post} toolkit={toolkit} />;
};

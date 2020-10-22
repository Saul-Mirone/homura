import React from 'react';
import { RssPost } from '../../index';
import { Post } from './index';
import { PostItem } from './PostItem';

export type DateItemProps = {
  date: string;
};

export const DateItem: React.FC<DateItemProps> = ({ date, children }) => (
  <div className="mb-4">
    <div className="uppercase text-gray-300 text-xs py-2 pl-8">{date}</div>
    {children}
  </div>
);

export const DateItemLegacy: React.FC<{
  date: string;
  posts: Array<Post>;
  setActivePostId: React.Dispatch<React.SetStateAction<number>>;
  activePostId: number;
  setPostList: React.Dispatch<React.SetStateAction<RssPost[]>>;
}> = ({ date, posts, setActivePostId, setPostList, activePostId }) => (
  <div className="mb-4">
    <div className="uppercase text-gray-300 text-xs py-2 pl-8">{date}</div>
    {posts.map((post) => (
      <PostItem
        onClick={() => {
          setActivePostId(post.id);
          setPostList((p) => {
            const tmp = [...p];
            const target = tmp.find((x) => x.id === post.id);
            if (target) {
              target.unread = false;
            }
            return tmp;
          });
        }}
        key={post.id.toString()}
        active={post.id === activePostId}
        {...post}
      />
    ))}
  </div>
);

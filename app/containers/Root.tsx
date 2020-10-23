import { DateTime } from 'luxon';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { PostAttributes } from '../model/post';
import { SourceAttributes } from '../model/source';
import { channel } from '../channel/child';
import { Reader } from '../components/Reader';
import { ArticleList } from './ArticleList';
import { SourceList } from './SourceList';
import { Mode } from '../constants/Mode';
import { Preset } from '../constants/Preset';

const Container: React.FC = ({ children }) => (
  <div className="bg-gray-800 w-full h-full min-h-screen flex divide-x divide-gray-900 divide-opacity-50">
    {children}
  </div>
);

console.log(channel);

export type RssSource = SourceAttributes & { unreadCount: number };
export type RssPost = Omit<PostAttributes, 'sourceId' | 'content'> &
  Pick<SourceAttributes, 'name' | 'icon'>;

const Root: React.FC = () => {
  const [mode, setMode] = React.useState(Mode.All);
  const [sourceList, setSourceList] = React.useState<Array<RssSource>>([]);
  const [activeSourceId, setActiveSourceId] = React.useState<number | Preset>(
    -1
  );
  const [postList, setPostList] = React.useState<Array<RssPost>>([]);
  const [activePostId, setActivePostId] = React.useState(-1);
  const [post, setPost] = React.useState<{
    content: string;
    date: string;
    sourceName: string;
    title: string;
  } | null>(null);
  const [overviewCount, setOverviewCount] = React.useState(0);

  React.useEffect(() => {
    channel
      .init()
      .then((xs) => setSourceList(xs))
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    switch (mode) {
      case Mode.Unread:
        channel.countBy('unread').then(setOverviewCount).catch(console.error);
        break;
      case Mode.Starred:
        channel.countBy('starred').then(setOverviewCount).catch(console.error);
        break;
      default:
      case Mode.All:
        channel.countBy('unread').then(setOverviewCount).catch(console.error);
        break;
    }
  }, [mode]);

  React.useEffect(() => {
    if (activePostId < 0) {
      setPost(null);
      return;
    }
    const source = sourceList.find((x) => x.id === activeSourceId);
    if (!source) {
      return;
    }
    channel
      .getPostById(activePostId)
      .then(({ content, title, date }) => {
        return setPost({
          content,
          title,
          sourceName: source.name,
          date: DateTime.fromJSDate(date).toFormat('LLL dd, yyyy'),
        });
      })
      .catch(console.error);
  }, [activePostId, activeSourceId, postList, sourceList]);

  React.useEffect(() => {
    if (typeof activeSourceId === 'number' && activeSourceId < 0) {
      return;
    }
    if (typeof activeSourceId === 'number') {
      channel
        .getSourceById(activeSourceId)
        .then(({ posts, icon, name }) => {
          return setPostList(
            posts.map((x) => ({
              name,
              icon: icon ?? null,
              ...x,
            }))
          );
        })
        .catch(console.error);
    }
  }, [activeSourceId]);

  return (
    <Container>
      <SourceList
        mode={mode}
        overviewCount={overviewCount}
        sourceList={sourceList}
        setSourceList={setSourceList}
        activeSourceId={activeSourceId}
        setActiveSourceId={setActiveSourceId}
        setPostList={setPostList}
      />
      <ArticleList
        activeSourceId={activeSourceId}
        setSourceList={setSourceList}
        activePostId={activePostId}
        setActivePostId={setActivePostId}
        postList={postList}
        setPostList={setPostList}
        mode={mode}
        setMode={setMode}
      />
      <Reader post={post ?? undefined} />
    </Container>
  );
};

export default hot(Root);

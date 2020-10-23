import { DateTime } from 'luxon';
import React from 'react';
import type { RssPost, RssSource } from '../Root';
import { channel } from '../../channel/child';
import { SubSideBar } from '../../components/SubSideBar';
import { DateItem } from '../../components/SubSideBar/DateItem';
import { PostItem } from '../../components/SubSideBar/PostItem';
import { Toolkit } from '../../components/SubSideBar/ToolKit';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';

export const ArticleList: React.FC<{
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  postList: RssPost[];
  setSourceList: React.Dispatch<React.SetStateAction<RssSource[]>>;
  setPostList: React.Dispatch<React.SetStateAction<RssPost[]>>;
  activeSourceId: number | Preset;
  activePostId: number;
  setActivePostId: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  mode,
  setMode,
  postList,
  setActivePostId,
  setPostList,
  activePostId,
  activeSourceId,
  setSourceList,
}) => {
  const postGroup = React.useMemo(() => {
    const tmp = [...postList];
    tmp.sort((x, y) => y.date.getTime() - x.date.getTime());
    return tmp.reduce((acc, cur) => {
      const arr = [...acc];
      const time = DateTime.fromJSDate(cur.date).toFormat('LLL dd, yyyy');
      const result = arr.find((x) => x.time === time);
      if (result) {
        result.list.push(cur);
      } else {
        arr.push({ time, list: [cur] });
      }

      return arr;
    }, [] as { time: string; list: RssPost[] }[]);
  }, [postList]);

  return (
    <SubSideBar header={<Toolkit mode={mode} onSwitchMode={setMode} />}>
      {postGroup.map(({ time, list }, i) => (
        <DateItem key={i.toString()} date={time}>
          {list.map(({ id, name, title, icon, unread }) => (
            <PostItem
              key={id.toString()}
              id={id}
              name={title}
              source={name}
              icon={icon ?? undefined}
              unread={unread ?? undefined}
              active={id === activePostId}
              onClick={async () => {
                setActivePostId(id);
                await channel.setPostUnread(id, false);
                setSourceList((source) => {
                  const tmp = [...source];
                  const active = tmp.find((x) => x.id === activeSourceId);
                  if (active) {
                    active.unreadCount -= 1;
                  }
                  return tmp;
                });

                setPostList((p) => {
                  const tmp = [...p];
                  const target = tmp.find((x) => x.id === id);
                  if (target) {
                    target.unread = false;
                  }
                  return tmp;
                });
              }}
            />
          ))}
        </DateItem>
      ))}
    </SubSideBar>
  );
};

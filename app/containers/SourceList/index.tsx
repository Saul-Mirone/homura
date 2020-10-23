import React from 'react';
import type { RssPost, RssSource } from '../Root';
import { rssParserChild } from '../../channel/child';
import { SideBar } from '../../components/SideBar';
import { BottomBar, Step } from '../../components/SideBar/BottomBar';
import { FeedSearchBar } from '../../components/SideBar/FeedSearchBar';
import { FeedSubscribeBar } from '../../components/SideBar/FeedSubscribeBar';
import { Header, OverviewTarget } from '../../components/SideBar/Header';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { Mode } from '../../constants/Mode';

export const SourceList: React.FC<{
  mode: Mode;
  sourceList: RssSource[];
  setSourceList: React.Dispatch<React.SetStateAction<RssSource[]>>;
  activeSourceId: number | OverviewTarget;
  setActiveSourceId: React.Dispatch<
    React.SetStateAction<number | OverviewTarget>
  >;
  overviewCount: number;

  setPostList: React.Dispatch<React.SetStateAction<RssPost[]>>;
}> = ({
  mode,
  sourceList,
  setSourceList,
  activeSourceId,
  setActiveSourceId,
  setPostList,
  overviewCount,
}) => {
  const [step, setStep] = React.useState<Step>();
  const [link, setLink] = React.useState('');
  const [name, setName] = React.useState('');

  const onSearch = async (currentLink: string) => {
    const result = await rssParserChild.checkUrl(currentLink);
    if (result) {
      setName(result);
      setStep(Step.EnterName);
    }
  };

  const onConfirm = async (currentName: string) => {
    const { posts, icon, ...rest } = await rssParserChild.confirm(currentName);
    setSourceList((list) => [
      ...list,
      { ...rest, icon: icon ?? null, unreadCount: posts.length },
    ]);
    setPostList(
      posts.map((x) => ({
        name,
        icon: icon ?? null,
        ...x,
      }))
    );
    setActiveSourceId(rest.id);
    setStep(undefined);
  };

  const renderBottom = (currentStep: Step) =>
    currentStep === Step.EnterUrl ? (
      <FeedSearchBar link={link} onLinkChange={setLink} onSearch={onSearch} />
    ) : (
      <FeedSubscribeBar
        link={link}
        name={name}
        onNameChange={setName}
        onConfirm={onConfirm}
      />
    );

  const bottom = (
    <BottomBar
      step={step}
      onClickPlus={() => setStep(Step.EnterUrl)}
      render={renderBottom}
    />
  );

  const overview = (
    <Header
      mode={mode}
      active={activeSourceId as OverviewTarget}
      count={overviewCount}
      onClick={setActiveSourceId}
    />
  );

  return (
    <SideBar overview={overview} bottom={bottom}>
      {sourceList.map(({ id, name: sourceName, icon, unreadCount }) => (
        <SideBarItem
          key={id.toString()}
          url={icon ?? undefined}
          name={sourceName}
          count={unreadCount}
          active={id === activeSourceId}
          onClick={() => setActiveSourceId(id)}
        />
      ))}
    </SideBar>
  );
};

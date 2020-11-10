import React from 'react';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import {
  ArchiveIcon,
  MailFilledIcon,
  StarFilledIcon,
  ViewListIcon,
} from '../Icon';
import { OverviewItem } from './OverviewItem';

export type HeaderProps = {
  mode: Mode;
  count: number;
  onClick: (target: Preset) => void;
  active: Preset | number | null;
};

export const Header: React.FC<HeaderProps> = ({
  active,
  mode,
  count,
  onClick,
}) => {
  switch (mode) {
    case Mode.Starred:
      return (
        <OverviewItem
          testId="source-list-preset-starred"
          target={Preset.Starred}
          icon={<StarFilledIcon />}
          activeId={active}
          count={count}
          onClick={onClick}
        />
      );
    case Mode.Unread:
      return (
        <OverviewItem
          testId="source-list-preset-unread"
          target={Preset.Unread}
          icon={<MailFilledIcon />}
          activeId={active}
          count={count}
          onClick={onClick}
        />
      );
    default:
    case Mode.All:
      return (
        <>
          <OverviewItem
            testId="source-list-preset-all"
            target={Preset.All}
            icon={<ViewListIcon />}
            activeId={active}
            count={count}
            onClick={onClick}
          />
          <OverviewItem
            testId="source-list-preset-archive"
            target={Preset.Archive}
            icon={<ArchiveIcon />}
            activeId={active}
            count={0}
            onClick={onClick}
          />
        </>
      );
  }
};

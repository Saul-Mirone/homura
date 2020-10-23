import React from 'react';
import { Mode } from '../../constants/Mode';
import {
  ArchiveIcon,
  MailFilledIcon,
  StarFilledIcon,
  ViewListIcon,
} from '../Icon';
import { SideBarItem } from './SideBarItem';

export enum OverviewTarget {
  All = 'All',
  Archive = 'Archive',
  Starred = 'Starred',
  Unread = 'Unread',
}

export type HeaderProps = {
  mode: Mode;
  count: number;
  active: OverviewTarget;
  onClick: (target: OverviewTarget) => void;
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
        <SideBarItem
          active={active === OverviewTarget.Starred}
          icon={<StarFilledIcon />}
          name="Starred"
          count={count}
          onClick={() => onClick(OverviewTarget.Starred)}
        />
      );
    case Mode.Unread:
      return (
        <SideBarItem
          active={active === OverviewTarget.Unread}
          icon={<MailFilledIcon />}
          name="Unread"
          count={count}
          onClick={() => onClick(OverviewTarget.Unread)}
        />
      );
    default:
    case Mode.All:
      return (
        <>
          <SideBarItem
            active={active === OverviewTarget.All}
            icon={<ViewListIcon />}
            name="All Items"
            count={count}
            onClick={() => onClick(OverviewTarget.All)}
          />
          <SideBarItem
            active={active === OverviewTarget.Archive}
            icon={<ArchiveIcon />}
            name="Archive"
            count={0}
            onClick={() => onClick(OverviewTarget.Archive)}
          />
        </>
      );
  }
};

import React from 'react';
import { RssLogoIcon } from '../LogoIcon';

type PostItemProps = {
  id: number;
  name: string;
  source: string;
  onClick(id: number): void;

  icon?: string;
  active?: boolean;
  unread?: boolean;
};

export const PostItem: React.FC<PostItemProps> = ({
  id,
  icon,
  name,
  source,
  onClick,
  active = false,
  unread = false,
}) => (
  <div
    onClick={() => onClick(id)}
    className={`${
      active ? 'bg-gray-700' : ''
    } leading-8 text-gray-300 flex items-center justify-start cursor-pointer px-3 py-2`}
  >
    <RssLogoIcon url={icon} />
    <div className="ml-2 leading-tight overflow-x-hidden ">
      <div className="text-xs text-gray-600 truncate">{source}</div>
      <div className={`text-sm ${!unread ? 'text-gray-600' : ''}`}>{name}</div>
    </div>
  </div>
);

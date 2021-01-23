import React from 'react';
import { StarFilledIcon } from '../Icon';
import { RssLogoIcon } from '../LogoIcon';

type PostItemProps = {
  id: number;
  name: string;
  source: string;
  active: boolean;
  unread: boolean;
  starred: boolean;
  onClick(id: number): void;

  icon?: string;
};

export const PostItem: React.FC<PostItemProps> = ({
  id,
  icon,
  name,
  source,
  onClick,
  active,
  unread,
  starred,
}) => (
  <div
    role="button"
    tabIndex={0}
    onKeyDown={() => onClick(id)}
    onClick={(e) => {
      e.stopPropagation();
      onClick(id);
    }}
    className={`${
      active ? 'bg-gray-700' : ''
    } leading-8 text-gray-300 flex items-center justify-start cursor-pointer px-3 py-2`}
  >
    <RssLogoIcon url={icon || null} />
    <div className="ml-2 leading-tight overflow-x-hidden ">
      <div className="truncate flex items-center">
        <div className="text-xs text-gray-600">{source}</div>
        {starred && (
          <div className="ml-2 w-3 h-3">
            <StarFilledIcon />
          </div>
        )}
      </div>
      <div className={`text-sm ${!unread && !starred ? 'text-gray-600' : ''}`}>
        {name}
      </div>
    </div>
  </div>
);

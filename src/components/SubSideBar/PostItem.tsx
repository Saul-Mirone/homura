import React from 'react';
import { StarFilledIcon } from '../Icon';
import { RssLogoIcon } from '../LogoIcon';

type PostItemProps = {
  name: string;
  source: string;
  active: boolean;
  unread: boolean;
  starred: boolean;
  onClick(): void;

  icon?: string;
};

export const PostItem: React.FC<PostItemProps> = ({
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
    onKeyDown={() => onClick()}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`${active ? 'bg-gray-700' : ''} sub-side-bar__post-item`}
  >
    <RssLogoIcon url={icon} />
    <div className="sub-side-bar__post-item-content">
      <div className="flex items-center truncate">
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

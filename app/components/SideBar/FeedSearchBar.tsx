import React from 'react';
import { SearchCircleFilledIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export type FeedSearchBarProps = {
  link: string;
  onLinkChange: (link: string) => void;
  onSearch: (link: string) => void;
};

export const FeedSearchBar: React.FC<FeedSearchBarProps> = ({
  onSearch,
  link,
  onLinkChange,
}) => (
  <div className="flex bg-gray-300 text-gray-800">
    <div className="flex-1">
      <input
        value={link}
        onChange={(e) => onLinkChange(e.target.value)}
        className="w-full p-2 text-xs bg-transparent"
        placeholder="Feed URL"
      />
    </div>
    <IconContainer
      className="transition duration-300 text-gray-700 hover:bg-gray-700 hover:text-gray-300"
      onClick={() => onSearch(link)}
    >
      <SearchCircleFilledIcon />
    </IconContainer>
  </div>
);

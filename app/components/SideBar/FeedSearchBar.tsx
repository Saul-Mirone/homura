import React from 'react';
import { SearchCircleFilledIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export type FeedSearchBarProps = {
  link: string;
  loading: boolean;
  onLinkChange: (link: string) => void;
  onSearch: (link: string) => void;
  onCancel: () => void;
};

export const FeedSearchBar: React.FC<FeedSearchBarProps> = ({
  onSearch,
  link,
  onLinkChange,
  onCancel,
  loading,
}) => {
  const inputEl = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputEl.current?.focus();
  }, []);

  return (
    <div className="flex bg-gray-300 text-gray-800">
      <div className="flex-1">
        <input
          ref={inputEl}
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          onBlur={() => {
            onCancel();
          }}
          className="w-full p-2 text-xs bg-transparent"
          placeholder="Feed URL"
        />
      </div>
      <IconContainer
        className={`transition duration-300 ${
          !loading
            ? 'hover:bg-gray-700 hover:text-gray-300 text-gray-700'
            : 'bg-gray-600 text-gray-300'
        }`}
        disabled={loading}
        onClick={() => {
          if (loading) return;
          onSearch(link);
        }}
      >
        <SearchCircleFilledIcon />
      </IconContainer>
    </div>
  );
};

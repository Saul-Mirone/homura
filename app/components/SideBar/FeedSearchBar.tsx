import React from 'react';
import { CloseIcon, SearchCircleFilledIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export type FeedSearchBarProps = {
  link: string;
  loading: boolean;
  hasError: boolean;
  onClickError: () => void;
  onLinkChange: (link: string) => void;
  onSearch: (link: string) => void;
  onCancel: () => void;
};

const Alert: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="text-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong className="font-bold">Search RSS failed!</strong>
    <span className="block">
      Please check the link and the internet connection.
    </span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
      <div
        tabIndex={0}
        role="button"
        className="h-4 w-4 text-red-700 cursor-pointer"
        onClick={onClick}
        onKeyDown={onClick}
      >
        <CloseIcon />
      </div>
    </span>
  </div>
);

export const FeedSearchBar: React.FC<FeedSearchBarProps> = ({
  onSearch,
  link,
  onLinkChange,
  onCancel,
  loading,
  hasError,
  onClickError,
}) => {
  const inputEl = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputEl.current?.focus();
  }, []);

  return (
    <>
      {hasError && (
        <Alert
          onClick={() => {
            onClickError();
            inputEl.current?.focus();
          }}
        />
      )}
      <div className="flex bg-gray-300 text-gray-800">
        <div className="flex-1">
          <input
            ref={inputEl}
            value={link}
            onChange={(e) => onLinkChange(e.target.value)}
            onBlur={() => {
              if (hasError) return;
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
    </>
  );
};

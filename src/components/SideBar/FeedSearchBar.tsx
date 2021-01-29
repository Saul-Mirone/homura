import React from 'react';
import { SearchCircleFilledIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';
import { Alert } from './Alert';

export type FeedSearchBarProps = {
  loading: boolean;
  hasError: boolean;
  onCancel: () => void;
  onClickError: () => void;
  onSearch: (link: string) => void;
};

export const FeedSearchBar: React.FC<FeedSearchBarProps> = ({
  onSearch,
  onCancel,
  loading,
  hasError,
  onClickError,
}) => {
  const [link, setLink] = React.useState('');
  const inputEl = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputEl.current?.focus();
  }, []);

  const clickAlertError = () => {
    onClickError();
    inputEl.current?.focus();
  };

  return (
    <>
      {hasError && <Alert onClick={clickAlertError} />}

      <div className="flex text-gray-800 bg-gray-300">
        <div className="flex-1">
          <input
            ref={inputEl}
            className="p-2 w-full text-xs bg-transparent"
            placeholder="Feed URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={() => {
              if (hasError) return;
              onCancel();
            }}
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

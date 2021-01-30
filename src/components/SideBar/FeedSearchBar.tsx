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

      <div className="sidebar-feed-search-bar__container">
        <div className="flex-1">
          <input
            ref={inputEl}
            className="sidebar-feed-search-bar__input"
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
          className={`sidebar-feed-search-bar__icon ${
            !loading ? 'show' : 'loading'
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

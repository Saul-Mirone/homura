import React from 'react';
import { CancelIcon, SearchIcon } from '../Icon';
import { IconContainerSmall } from '../LogoIcon';

export const SearchBar: React.FC = () => {
  const [active, setActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const { current } = inputRef;
    if (current) {
      current.focus();
    }
  }, [active]);

  return (
    <div
      className={`p-2 cursor-pointer flex ${
        active ? 'rounded bg-gray-700' : ''
      }`}
    >
      <IconContainerSmall onClick={() => setActive(true)}>
        <SearchIcon />
      </IconContainerSmall>
      {active && (
        <>
          <input
            ref={inputRef}
            className="flex-1 w-full h-5 text-xs px-2 bg-transparent text-gray-200"
          />
          <IconContainerSmall onClick={() => setActive(false)}>
            <CancelIcon />
          </IconContainerSmall>
        </>
      )}
    </div>
  );
};

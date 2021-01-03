import React from 'react';
import { CheckCircleFilledIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export type FeedSubscribeBarProps = {
  initialName: string;
  link: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
};

export const FeedSubscribeBar: React.FC<FeedSubscribeBarProps> = ({
  link,
  initialName,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = React.useState(initialName);
  const inputEl = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputEl.current?.focus();
  }, []);

  return (
    <>
      <div className="p-2 text-xs truncate">{link}</div>
      <div className="flex bg-gray-300 text-gray-800">
        <div className="flex-1">
          <input
            ref={inputEl}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              onCancel();
            }}
            className="w-full p-2 text-xs bg-transparent"
            placeholder="Save as Name"
          />
        </div>
        <IconContainer
          onClick={() => onConfirm(name)}
          className="transition duration-300 text-gray-700 hover:bg-gray-700 hover:text-gray-300"
        >
          <CheckCircleFilledIcon />
        </IconContainer>
      </div>
    </>
  );
};

import React, { ChangeEvent } from 'react';
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

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const onBlur = () => onCancel();
  const onClick = () => onConfirm(name);

  return (
    <>
      <div className="p-2 text-xs truncate">{link}</div>
      <div className="flex text-gray-800 bg-gray-300">
        <div className="flex-1">
          <input
            ref={inputEl}
            value={name}
            onChange={onChange}
            onBlur={onBlur}
            className="p-2 w-full text-xs bg-transparent"
            placeholder="Save as Name"
          />
        </div>
        <IconContainer
          onClick={onClick}
          className="text-gray-700 transition duration-300 hover:bg-gray-700 hover:text-gray-300"
        >
          <CheckCircleFilledIcon />
        </IconContainer>
      </div>
    </>
  );
};

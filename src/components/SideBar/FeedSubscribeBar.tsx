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
      <div className="sidebar-subscribe-bar__link">{link}</div>
      <div className="sidebar-subscribe-bar__content">
        <div className="flex-1">
          <input
            ref={inputEl}
            value={name}
            onChange={onChange}
            onBlur={onBlur}
            className="sidebar-subscribe-bar__input"
            placeholder="Save as Name"
          />
        </div>
        <IconContainer
          onClick={onClick}
          className="sidebar-subscribe-bar__icon"
        >
          <CheckCircleFilledIcon />
        </IconContainer>
      </div>
    </>
  );
};

import React from 'react';
import {
  MailFilledIcon,
  MailIcon,
  ShareIcon,
  StarFilledIcon,
  StarIcon,
} from '../Icon';
import { IconContainer } from '../LogoIcon';

export const Toolkit: React.FC = () => {
  const [starred, setStarred] = React.useState(false);
  const [unread, setUnread] = React.useState(false);

  return (
    <div className="flex justify-end">
      <div className="inline-flex text-gray-800 my-1 mr-1">
        <IconContainer className="py-1" onClick={() => setStarred((x) => !x)}>
          {starred ? <StarFilledIcon /> : <StarIcon />}
        </IconContainer>
        <IconContainer className="py-1" onClick={() => setUnread((x) => !x)}>
          {unread ? <MailFilledIcon /> : <MailIcon />}
        </IconContainer>
        <IconContainer className="py-1">
          <ShareIcon />
        </IconContainer>
      </div>
    </div>
  );
};

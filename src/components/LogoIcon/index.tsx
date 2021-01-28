import React from 'react';
import { RssIcon } from '../Icon';
import { ImageIcon } from './ImageIcon';

export * from './IconContainer';
export * from './ImageIcon';

type Props = {
  url?: string;
  icon: JSX.Element | null;
};

export const LogoIcon: React.FC<Props> = ({ url, icon }) => {
  if (url !== null && url !== undefined) {
    return <ImageIcon url={url} />;
  }

  return <div className="h-6 w-6 flex-shrink-0">{icon}</div>;
};

export const RssLogoIcon: React.FC<{ url?: string }> = ({ url }) => {
  return <LogoIcon url={url} icon={<RssIcon />} />;
};

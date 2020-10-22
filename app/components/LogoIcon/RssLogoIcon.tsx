import React from 'react';
import { LogoIcon } from '.';
import { RssIcon } from '../Icon';

export const RssLogoIcon: React.FC<{ url?: string }> = ({ url }) => {
  if (url) {
    return <LogoIcon url={url} />;
  }

  return <LogoIcon icon={<RssIcon />} />;
};

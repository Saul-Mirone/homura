import React from 'react';
import { ImageIcon } from './ImageIcon';
import { RssIcon } from '../Icon';

export * from './IconContainer';
export * from './ImageIcon';

type ImageProps = {
  url: string;
};

type IconProps = {
  icon: JSX.Element;
};

function isImageProps(props: ImageProps | IconProps): props is ImageProps {
  const { url } = props as ImageProps;
  return url !== undefined && url !== null;
}

export const LogoIcon: React.FC<ImageProps | IconProps> = (props) => {
  if (isImageProps(props)) {
    const { url } = props;
    return <ImageIcon url={url} />;
  }

  const { icon } = props;
  return <div className="h-6 w-6 flex-shrink-0">{icon}</div>;
};

export const RssLogoIcon: React.FC<{ url?: string }> = ({ url }) => {
  if (url) {
    return <LogoIcon url={url} />;
  }

  return <LogoIcon icon={<RssIcon />} />;
};

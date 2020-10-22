import React from 'react';
import { ImageIcon } from './index';

export * from './IconContainer';
export * from './ImageIcon';
export * from './RssLogoIcon';

type ImageProps = {
  url: string;
};

type IconProps = {
  icon: JSX.Element;
};

function isImageProps(props: ImageProps | IconProps): props is ImageProps {
  return Object.hasOwnProperty.call(props, 'url');
}

export const LogoIcon: React.FC<ImageProps | IconProps> = (props) => {
  if (isImageProps(props)) {
    return <ImageIcon url={props.url} />;
  }

  return <div className="h-6 w-6">{props.icon}</div>;
};

import React from 'react';
import { RssIcon } from '../Icon';
import { ImageIcon } from './ImageIcon';
import './style.pcss';

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

    return <div className="logo-icon">{icon}</div>;
};

export const RssLogoIcon: React.FC<{ url?: string }> = ({ url }) => {
    return <LogoIcon url={url} icon={<RssIcon />} />;
};

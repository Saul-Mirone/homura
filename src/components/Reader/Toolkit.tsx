import React from 'react';
import { MailFilledIcon, MailIcon, ShareIcon, StarFilledIcon, StarIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

type ToolkitProps = {
    starred: boolean;
    onSwitchStarred: (prev: boolean) => void;
    unread: boolean;
    onSwitchUnread: (prev: boolean) => void;
    onShare: () => void;
};

export const Toolkit: React.FC<ToolkitProps> = ({ starred, onSwitchStarred, unread, onSwitchUnread, onShare }) => (
    <div className="flex justify-end">
        <div className="inline-flex my-1 mr-1 text-gray-800">
            <IconContainer className="py-1" onClick={() => onSwitchStarred(starred)}>
                {starred ? <StarFilledIcon /> : <StarIcon />}
            </IconContainer>
            <IconContainer className="py-1" onClick={() => onSwitchUnread(unread)}>
                {unread ? <MailFilledIcon /> : <MailIcon />}
            </IconContainer>
            <IconContainer className="py-1" onClick={() => onShare()}>
                <ShareIcon />
            </IconContainer>
        </div>
    </div>
);

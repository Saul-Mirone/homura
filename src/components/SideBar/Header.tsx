import React from 'react';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import { ArchiveIcon, MailFilledIcon, StarFilledIcon, ViewListIcon } from '../Icon';
import { OverviewItem } from './OverviewItem';

export type HeaderProps = {
    fold: boolean;
    mode: Mode;
    count: number;
    active: Preset | number | undefined;
    onClick: (target: Preset) => void;
};

export const Header: React.FC<HeaderProps> = ({ active, mode, count, fold, onClick }) => {
    switch (mode) {
        case Mode.Starred:
            return (
                <OverviewItem
                    fold={fold}
                    target={Preset.Starred}
                    icon={<StarFilledIcon />}
                    activeId={active}
                    count={count}
                    onClick={onClick}
                />
            );
        case Mode.Unread:
            return (
                <OverviewItem
                    fold={fold}
                    target={Preset.Unread}
                    icon={<MailFilledIcon />}
                    activeId={active}
                    count={count}
                    onClick={onClick}
                />
            );
        default:
        case Mode.All:
            return (
                <>
                    <OverviewItem
                        fold={fold}
                        target={Preset.All}
                        icon={<ViewListIcon />}
                        activeId={active}
                        count={count}
                        onClick={onClick}
                    />
                    <OverviewItem
                        fold={fold}
                        target={Preset.Archive}
                        icon={<ArchiveIcon />}
                        activeId={active}
                        count={0}
                        onClick={onClick}
                    />
                </>
            );
    }
};

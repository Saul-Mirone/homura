import React from 'react';
import { CancelIcon, SearchIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

type SearchBarProps = {
    onSearch: (keywords: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [active, setActive] = React.useState(false);
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const { current } = inputRef;
        if (current) {
            current.focus();
        }
    }, [active]);

    return (
        <div className={`sub-side-bar__search ${active ? 'active' : ''}`}>
            <IconContainer
                mini
                onClick={() => {
                    if (!active) {
                        setActive(true);
                        return;
                    }
                    onSearch(value);
                }}
            >
                <SearchIcon />
            </IconContainer>
            {active && (
                <>
                    <input
                        ref={inputRef}
                        value={value}
                        className="sub-side-bar__search-input"
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <IconContainer
                        mini
                        onClick={() => {
                            setActive(false);
                            setValue('');
                            onSearch('');
                        }}
                    >
                        <CancelIcon />
                    </IconContainer>
                </>
            )}
        </div>
    );
};

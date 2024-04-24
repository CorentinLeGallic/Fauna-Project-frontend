import React from 'react';
import PageSwitcher from './PageSwitcher';
import useWindowSize from '../hooks/useWindowSize';

const Header = () => {

    const windowSize = useWindowSize();

    return (
        <header className={(windowSize.height < windowSize.width * 1.1) && (windowSize.width >= 620) ? 'normal' : 'short'}>
            <h1>Fauna Project</h1>
            {((windowSize.height < windowSize.width * 1.1) && (windowSize.width >= 620)) && <PageSwitcher screenSize="normal" />}
        </header>
    );
};

export default Header;
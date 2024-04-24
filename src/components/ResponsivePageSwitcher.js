import React from 'react';
import PageSwitcher from './PageSwitcher';
import useWindowSize from '../hooks/useWindowSize';

const ResponsivePageSwitcher = () => {

    const windowSize = useWindowSize();

    const isActive = (windowSize.height > windowSize.width * 1.1) || (windowSize.width <= 620);

    return (
        <div className={isActive ? 'responsive-page-switcher active' : 'responsive-page-switcher'}>
            {isActive && <PageSwitcher screenSize="short" />}
        </div>
    );
};

export default ResponsivePageSwitcher;
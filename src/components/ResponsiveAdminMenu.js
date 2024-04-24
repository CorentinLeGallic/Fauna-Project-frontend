import React, { useTransition } from 'react';
import AdminMenu from './AdminMenu';
import useWindowSize from '../hooks/useWindowSize';
import { useTransition, animated } from '@react-spring/web';

const ResponsiveAdminMenu = () => {

    const AnimatedAdminMenu = animated(AdminMenu)

    const transition = useTransition(AdminMenu, {
        from: { pointerEvents: "auto", left: initialMount ? "0" : "-300px" },
        enter: { pointerEvents: "auto", left: "0" },
        leave: { pointerEvents: "none", left: "-300px" },
        config: {
            duration: 100,
        }
    })

    const windowSize = useWindowSize();

    const isActive = (windowSize.height > windowSize.width * 1.1);

    return (
        <div className={isActive ? 'responsive-admin-menu active' : 'responsive-admin-menu'}>
            {isActive && <AdminMenu screenSize='short' />}
        </div>
    );
};

export default ResponsiveAdminMenu;
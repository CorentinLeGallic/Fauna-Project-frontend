import React from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { Link } from 'react-router-dom';

const icons = {
    "Accueil": "home",
    "Grille": "grid",
    "Concepteur": "teambuilder"
}

const PageSwitcher = ({ screenSize }) => {

    const [user,] = useSessionStorage("user", null);
    const [gameStarted,] = useSessionStorage("gameStarted", null)

    const pages = user ? gameStarted ? {
        Accueil: "/home",
        Grille: "/grid",
    } : user.isAdmin ? {
        Accueil: "/home",
        Concepteur: "/teambuilder"
    } : {
        Accueil: "/home",
    } : {
        Accueil: "/home",
    }

    return (
        <ul className={screenSize === "short" ? "page-switcher short" : "page-switcher normal"}>
            {Object.keys(pages).map((key, index) => (
                <li key={index}>
                    <Link to={pages[key]} className='page-link'>
                        {screenSize === "short" ? <img className='page-icon' src={'./medias/' + icons[key] + '.png'} alt={key}></img> : key}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default PageSwitcher;
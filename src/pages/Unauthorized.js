import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/home")
    }

    return (
        <div className='unauthorized'>
            <h1>Authentification failed.</h1>
            <h2>Vous n'avez pas les autorisations nécessaires. Afin d'accéder au site dans son intégalité, utilisez le lien qui vous a été envoyé.</h2>
            <button onClick={handleClick}>Accueil</button>
        </div>
    );
};

export default Unauthorized;
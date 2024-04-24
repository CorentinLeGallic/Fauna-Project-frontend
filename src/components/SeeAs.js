import React from 'react';

const SeeAs = ({ seeAsAdmin, handleSeeAsChange }) => {
    return (
        <div className='see-as' onClick={handleSeeAsChange}>Voir en tant {seeAsAdmin ? "que joueur" : "qu'admin"}</div>
    );
};

export default SeeAs;
import React from 'react';

const SaveGrid = ({ handleSave }) => {

    return (
        <button className='save-grid' onClick={handleSave}>Enregistrer</button>
    );
};

export default SaveGrid;
import React from 'react';

const Offline = ({ isReady }) => {
    return (
        <div className={isReady ? "offline" : "offline active"}>
            <span>Vous êtes actuellement déconnecté.</span>
        </div>
    );
};

export default Offline;
import React, { useState, useEffect } from 'react';

const GridCell = ({ index, state, goal, teamIndex, handleClick, user, seeAsAdmin, isReady }) => {

    const [claimable, setClaimable] = useState((state === "rejected" || state === "missing") && (!user.isAdmin || !seeAsAdmin))

    // useEffect(() => {
    //     console.log("Goal : " + goal.name + " - state : " + state)
    // }, [goal, state])

    useEffect(() => {
        setClaimable((state === "rejected" || state === "missing") && (!user.isAdmin || !seeAsAdmin))
    }, [state, seeAsAdmin])

    // useEffect(() => {
    //     console.log("Claimable : " + claimable)
    //     console.log("IsReady : " + isReady)
    // }, [claimable, isReady])

    return (
        <li key={index} className={"grid-cell " + state + (claimable ? " claimable" : "") + (claimable && isReady ? " active" : "")} {...(claimable ? { onClick: () => handleClick(teamIndex, goal.index) } : {})} {...(claimable && !isReady) ? { title: "La connection au serveur est impossible. Veuillez réessayer plus tard." } : {}}>
            <span className='goal'>{goal.name}</span>
            {claimable && isReady && <span className='claim'>Valider</span>}
        </li>
    );
};

export default GridCell;
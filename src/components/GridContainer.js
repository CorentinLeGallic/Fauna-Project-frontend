import React from 'react';
import GridCell from './GridCell';
import useSessionStorage from "../hooks/useSessionStorage";
import useWindowSize from '../hooks/useWindowSize';

const GridContainer = ({ team, grid, handleClick, seeAsAdmin, isReady }) => {

    const windowSize = useWindowSize()

    const style = {
        gridTemplateColumns: "repeat(" + grid.size + ",minmax(0, 1fr))",
        gridTemplateRows: "repeat(" + grid.size + ", minmax(0, 1fr))",
    }

    const [user, setUser] = useSessionStorage("user", null);

    return (
        <ul className={(seeAsAdmin ? 'grid-container admin' : 'grid-container') + ((windowSize.height < windowSize.width * 1.1 && windowSize.width >= 620) ? ' normal' : ' short')} style={style} >
            {
                grid.goals.map((goal, index) => (
                    <GridCell key={index} state={team.grid[index]} goal={{
                        name: goal,
                        index: index,
                    }} teamIndex={team.index} handleClick={handleClick} user={user} seeAsAdmin={seeAsAdmin} isReady={isReady} />
                ))
            }
        </ul >
    );
};

export default GridContainer;
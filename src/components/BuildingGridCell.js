import React, { useRef } from 'react';

const BuildingGridCell = ({ index, goal, category, handleRightClick, isCompleted, handleClick }) => {

    const ref = useRef()

    return (
        <li ref={ref} key={index} className={"building-grid-cell" + (isCompleted ? " completed" : "")} {...(isCompleted ? { onContextMenu: (e) => handleRightClick(e, index, ref.current) } : { onContextMenu: (e) => e.preventDefault(), onClick: handleClick })} >
            <span className='category'>{category.toUpperCase()}</span>
            <span className='goal'>{goal}</span>
            {!isCompleted && <img draggable="false" src='./medias/add.png'></img>}
        </li>
    );
};

export default BuildingGridCell;
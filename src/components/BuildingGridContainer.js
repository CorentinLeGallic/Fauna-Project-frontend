import React, { useEffect, useState } from 'react';
import BuildingGridCell from './BuildingGridCell';
import useTimeout from '../hooks/useTimeout';

const BuildingGridContainer = ({ gridSize, grid, handleGoalChange, handleDelete, selectedCell, setSelectedCell }) => {

    useEffect(() => {
        console.log(grid)
    }, [grid])

    const style = {
        gridTemplateColumns: "repeat(" + gridSize + ", minmax(0, 1fr))",
        gridTemplateRows: "repeat(" + gridSize + ", minmax(0, 1fr))",
    }

    const [rightClickMenu, setRightClickMenu] = useState({
        isActive: false,
        coordinates: [0, 0]
    })

    const [rightClickTimeout] = useTimeout((args) => {
        setRightClickMenu({
            isActive: true,
            coordinates: [args.target.offsetLeft + (args.e.clientX - args.rect.left), args.target.offsetTop + (args.e.clientY - args.rect.top)]
        })
    }, 1)

    const handleRightClick = (e, gridCell, target) => {
        console.log(e)
        console.log(gridCell)
        console.log(target)
        e.preventDefault()
        const rect = target.getBoundingClientRect()
        if (rightClickMenu.isActive) {
            setRightClickMenu({
                ...rightClickMenu,
                isActive: false,
            })
        }
        // setTimeout(() => {
        //     setRightClickMenu({
        //         isActive: true,
        //         coordinates: [target.offsetLeft + (e.clientX - rect.left), target.offsetTop + (e.clientY - rect.top)]
        //     })
        // }, 1)
        rightClickTimeout({
            e: e,
            target: target,
            rect: rect
        })
        setSelectedCell(gridCell)
    }

    const handleClick = (e) => {
        setRightClickMenu({
            ...rightClickMenu,
            isActive: false,
        })
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [rightClickMenu])

    return (
        <ul className='building-grid-container grid-container' style={style}>
            <div onContextMenu={(e) => e.preventDefault()} className={rightClickMenu.isActive ? 'right-click-menu active' : 'right-click-menu'} style={{ left: rightClickMenu.coordinates[0], top: rightClickMenu.coordinates[1] }}>
                <div href="#" className="sort-option" onClick={() => { handleGoalChange(selectedCell, "edit") }}>
                    <img draggable="false" src='./medias/edit.png' />
                    <span>Modifier</span>
                </div>
                <div href="#" className="sort-option" onClick={() => { handleDelete(selectedCell) }}>
                    <img draggable="false" src='./medias/delete.png' />
                    <span>Supprimer</span>
                </div>
            </div>
            {grid.goals.map((goal, index) => {

                const category = grid.categories[index]
                const isCompleted = goal && category

                return (
                    <BuildingGridCell key={index} index={index} isCompleted={isCompleted} category={category} goal={goal} handleRightClick={handleRightClick} handleClick={() => handleGoalChange(index, "add")} />
                )
            })}
        </ul>
    );
};

export default BuildingGridContainer;

{/* <div className={isActive ? "sort-dropdown active" : "sort-dropdown"}>
<span href="#" className="sort-option" onClick={() => { handleOptionSelection(3) }}>3x3</span>
<span href="#" className="sort-option" onClick={() => { handleOptionSelection(4) }}>4x4</span>
<span href="#" className="sort-option" onClick={() => { handleOptionSelection(5) }}>5x5</span>
<span href="#" className="sort-option" onClick={() => { handleOptionSelection(6) }}>6x6</span>
</div> */}
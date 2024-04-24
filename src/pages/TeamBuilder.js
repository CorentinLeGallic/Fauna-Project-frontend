import React, { useState, useEffect, useRef, useContext } from 'react';
import Header from '../components/Header';
import BuildingGridContainer from '../components/BuildingGridContainer';
import SaveGrid from '../components/SaveGrid';
import ChangeGoal from '../components/ChangeGoal';
import getDescendantNodes from '../utils/getDescendantNodes';
import useSessionStorage from '../hooks/useSessionStorage';
import { WebsocketContext } from "../contexts/Contexts.js";
import Offline from '../components/Offline';
import ResponsivePageSwitcher from '../components/ResponsivePageSwitcher';
import useWindowSize from '../hooks/useWindowSize';

const TeamBuilder = () => {

    const windowSize = useWindowSize()

    const [isActive, setIsActive] = useState(false)
    const [changeGoalMenu, setChangeGoalMenu] = useState({
        isActive: false,
        changeType: ""
    })
    const [selectedCell, setSelectedCell] = useState(0)

    const [buildingGrid, setBuildingGrid] = useState(JSON.parse(sessionStorage.getItem("grid")))
    const [grid, setGrid] = useSessionStorage("grid", null)

    const [isReady, sendData, getData] = useContext(WebsocketContext);

    // const [gridSize, setGridSize] = useState(grid.size)

    // const [grid, setGrid] = useState({ // requête de la grille au plugin
    //     size: gridSize,
    //     goals: ["AAA", "BBB"].concat(Array(gridSize ** 2 - 2).fill("")),
    //     categories: ["CRAFT", "AUTRE"].concat(Array(gridSize ** 2 - 2).fill(""))
    // })

    useEffect(() => {
        console.log(Date.now())
    }, [])

    useEffect(() => {
        setBuildingGrid(grid)
    }, [grid])

    useEffect(() => {
        if (isReady) {
            sendData("error", {
                data: "error"
            })
        }
    }, [isReady]);

    // useEffect(() => {
    //     console.log((gridSize ** 2 - grid.goals.length))
    //     setGrid({
    //         size: gridSize,
    //         goals: grid.goals.slice(0, gridSize ** 2).concat(Array((gridSize ** 2 - grid.goals.length) <= 0 ? 0 : (gridSize ** 2 - grid.goals.length)).fill("")),
    //         categories: grid.categories.slice(0, gridSize ** 2).concat(Array((gridSize ** 2 - grid.categories.length) <= 0 ? 0 : (gridSize ** 2 - grid.categories.length)).fill(""))
    //     })
    // }, [gridSize])

    const ref = useRef()

    const handleClick = (e) => {
        if ((e.target === ref.current || getDescendantNodes(ref.current).includes(e.target)) && !isActive) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }

    const handleOptionSelection = (selection) => {
        // setGridSize(selection)
        setBuildingGrid({
            size: selection,
            goals: buildingGrid.goals.slice(0, selection ** 2).concat(Array((selection ** 2 - buildingGrid.goals.length) <= 0 ? 0 : (selection ** 2 - buildingGrid.goals.length)).fill("")),
            categories: buildingGrid.categories.slice(0, selection ** 2).concat(Array((selection ** 2 - buildingGrid.categories.length) <= 0 ? 0 : (selection ** 2 - buildingGrid.categories.length)).fill(""))
        })
        setIsActive(false)
    }

    const handleGoalChange = (index, changeType) => {
        console.log("handleGoalChange")
        setSelectedCell(index)
        setChangeGoalMenu({
            isActive: true,
            changeType: changeType
        })
    }

    const handleDelete = (index) => {
        buildingGrid.goals[index] = "";
        buildingGrid.categories[index] = "";
    }

    const handleChange = (category, goal) => {

        const newGoals = buildingGrid.goals.map((item, index) => {
            if (index === selectedCell) {
                return goal;
            } else {
                return item;
            }
        })

        const newCategories = buildingGrid.categories.map((item, index) => {
            if (index === selectedCell) {
                return category;
            } else {
                return item;
            }
        })

        setBuildingGrid({
            ...buildingGrid,
            goals: newGoals,
            categories: newCategories
        })
        // setGrid({
        //     ...grid,
        //     goals: newGoals,
        //     categories: newCategories
        // })
    }

    const handleSave = () => {
        console.log(buildingGrid)
        sendData("grid", {
            grid: buildingGrid
        })
        // setGrid(buildingGrid)
    }

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [isActive]);

    return (
        <div className='team-builder'>
            <Header />
            <main className={(windowSize.height < windowSize.width * 1.1 && windowSize.width >= 620) ? 'team-builder-main normal' : 'team-builder-main short'}>
                <section className='main-section'>
                    <ChangeGoal grid={buildingGrid} key={changeGoalMenu.isActive} menu={changeGoalMenu} setMenu={setChangeGoalMenu} handleSave={handleChange} cell={{ category: buildingGrid.categories[selectedCell], goal: buildingGrid.goals[selectedCell] }} />
                    <div className='main-container'>
                        <div className="grid-size">
                            <span className='grid-size-label'>Taille de la grille : </span>
                            <div className='size-changer'>
                                <button ref={ref}>
                                    <p>{buildingGrid.size}x{buildingGrid.size}</p>
                                    <img draggable="false" src='./medias/dropdown.png' className={isActive ? "active" : ""} />
                                </button>
                                <div className={isActive ? "sort-dropdown active" : "sort-dropdown"}>
                                    <span href="#" className="sort-option" onClick={() => { handleOptionSelection(3) }}>3x3</span>
                                    <span href="#" className="sort-option" onClick={() => { handleOptionSelection(4) }}>4x4</span>
                                    <span href="#" className="sort-option" onClick={() => { handleOptionSelection(5) }}>5x5</span>
                                    <span href="#" className="sort-option" onClick={() => { handleOptionSelection(6) }}>6x6</span>
                                </div>
                            </div>
                        </div>
                        <BuildingGridContainer gridSize={buildingGrid.size} grid={buildingGrid} setGrid={setBuildingGrid} handleGoalChange={handleGoalChange} handleDelete={handleDelete} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
                        {isReady ? <SaveGrid handleSave={handleSave} /> : <Offline isReady={isReady} />}
                    </div>
                </section>
            </main>
            <ResponsivePageSwitcher />
        </div>
    );
};

export default TeamBuilder;
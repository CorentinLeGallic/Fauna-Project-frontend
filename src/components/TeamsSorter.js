import React, { useEffect, useRef, useState } from 'react';
import getDescendantNodes from '../utils/getDescendantNodes';

const TeamsSorter = ({ sortBy, setSortBy, screenSize }) => {

    const [isActive, setIsActive] = useState(false)

    const ref = useRef()

    const handleClick = (e) => {
        if ((e.target === ref.current || getDescendantNodes(ref.current).includes(e.target)) && !isActive) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }

    const handleOptionSelection = (selection) => {
        setSortBy(selection)
        setIsActive(false)
    }

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [isActive]);

    return (
        <div className={screenSize === "short" ? "right-teams-header short" : "right-teams-header normal"}>
            <button ref={ref}>
                <p>{"Par " + (sortBy === "index" ? "numéro" : "progression")}</p>
                <div className='dropdown-img'>
                    <img draggable="false" src='./medias/dropdown.png' className={isActive ? "active" : ""} />
                </div>
            </button>
            <div className={isActive ? "sort-dropdown active" : "sort-dropdown"}>
                <span href="#" className="sort-option" onClick={() => { handleOptionSelection("index") }}>Par numéro</span>
                <span href="#" className="sort-option" onClick={() => { handleOptionSelection("progress") }}>Par progression</span>
            </div>
        </div>
    );
};

export default TeamsSorter;
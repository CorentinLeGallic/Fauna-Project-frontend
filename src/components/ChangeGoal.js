import React, { useEffect, useState, useRef } from 'react';
import Backdrop from '@mui/material/Backdrop';
import getDescendantNodes from '../utils/getDescendantNodes';
import useSessionStorage from '../hooks/useSessionStorage';

const ChangeGoal = ({ menu, setMenu, handleSave, cell, grid }) => {

    const ref = useRef()

    const [title, setTitle] = useState("")

    const [goals, setGoals] = useSessionStorage("goals", null)

    useEffect(() => {
        console.log(goals)
    }, [goals])

    useEffect(() => {
        console.log("Cell :")
        console.log(cell)
    }, [cell])

    useEffect(() => {
        console.log(grid)
    }, [grid])

    // const [goals, setGoals] = useState({
    //     "CRAFT": ["Jukebox", "Table"],
    //     "ACHIEVEMENT": ["Repopulation", "Getting wood"],
    //     "ENCHANTEMENT": ["Protection I", "Sharpness V"],
    //     "BIOME": ["Snowy taiga", "Jungle"],
    //     "DIMENSION": ["Nether", "End"],
    //     "KILL": ["Cow", "Wither"]
    // }) // requête au plugin

    const categories = Object.keys(goals)

    // useEffect(() => {
    //     console.log(menu)
    // }, [menu])

    // useEffect(() => {
    //     console.log(cell)
    //     console.log(cell.category ? true : false)
    //     console.log(Object.keys(goals))
    //     console.log(Object.keys(goals).includes(cell.category))
    // }, [cell])

    // useEffect(() => {
    //     console.log("Component first mount")
    // }, [])

    const [selectedCategory, setSelectedCategory] = useState(cell.category ? cell.category : categories[0])
    const [selectedGoal, setSelectedGoal] = useState(cell.goal ? cell.goal : selectedCategory === "AUTRE" ? "" : goals[selectedCategory][0])

    useEffect(() => {
        console.log("SelectedCategory : " + selectedCategory)
        console.log("SelectedGoal : " + selectedGoal)
    }, [selectedCategory, selectedGoal])

    // const resetForm = () => {
    //     setSelectedCategory(categories[0])
    //     setSelectedGoal(goals[categories[0]][0])
    // }

    const handleChange = (event, selectType) => {
        switch (selectType) {
            case "category":
                setSelectedCategory(event.target.value)
                if (event.target.value === "AUTRE") {
                    setSelectedGoal("")
                } else {
                    setSelectedGoal(goals[event.target.value][0])
                }
                break;
            case "goal":
                setSelectedGoal(event.target.value)
                break;
        }
    }

    useEffect(() => {
        switch (menu.changeType) {
            case "add":
                setTitle("Ajouter un objectif");
                break;
            case "edit":
                setTitle("Modifier un objectif");
                break;
        }
    }, [menu.changeType])

    // useEffect(() => {
    //     console.log(selectedGoal)
    // }, [selectedGoal])

    const handleClose = (e) => {
        if (!(e.target === ref.current || getDescendantNodes(ref.current).includes(e.target)) || e.target.className.includes("action")) {
            setMenu({
                ...menu,
                isActive: false
            })
            // resetForm()
        }
    };

    const handleRandomGoal = (e) => {
        const availableGoals = Object.values(goals).flat().filter(goal => !grid.goals.includes(goal))
        if (availableGoals.length > 0) {
            const newGoal = availableGoals[Math.floor(Math.random() * availableGoals.length)];
            setSelectedCategory(
                Object.keys(goals).find(key => goals[key] === Object.values(goals).find((category) => category.includes(newGoal)))
            )
            setSelectedGoal(newGoal)
        } else {
            setSelectedCategory("AUTRE")
            setSelectedGoal("")
        }
    };


    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={menu.isActive}
                onClick={handleClose}
            >
                <div ref={ref} className='change-goal'>
                    <span className='title'>{title}</span>
                    <form action="">
                        <div className="category">
                            <label htmlFor="select-category">Catégorie :</label>
                            <select name="select-category" id="select-category" value={selectedCategory} onChange={(e) => handleChange(e, "category")}>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.toUpperCase()}>{category.charAt(0).toUpperCase() + category.slice(1).toLocaleLowerCase()}</option>
                                ))}
                                <option value="AUTRE">Autre</option>
                            </select>
                        </div>
                        <div className="goal">
                            <label htmlFor="select-goal">Objectif :</label>
                            {selectedCategory === "AUTRE" ? (
                                <input type='text' value={selectedGoal} onChange={(e) => handleChange(e, "goal")}></input>
                            ) : (
                                <select name="select-goal" id="select-goal" value={selectedGoal} onChange={(e) => handleChange(e, "goal")}>
                                    {goals[selectedCategory].map((goal, index) => (
                                        <option key={index} value={goal}>{goal}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="random-goal" onClick={handleRandomGoal}>Générer aléatoirement</div>
                    </form>
                    <div className="actions">
                        <button className="action save-change" onClick={() => {
                            handleSave(selectedCategory, selectedGoal)
                            // resetForm()
                        }}>Enregistrer</button>
                        <button className="action cancel-change">Annuler</button>
                    </div>
                </div>
            </Backdrop>
        </div>
    );
};

export default ChangeGoal;
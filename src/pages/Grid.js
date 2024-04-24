import React, { useState, useContext, useEffect } from 'react';
import Header from "../components/Header";
import AdminMenu from '../components/AdminMenu';
import GridContainer from '../components/GridContainer';
import { WebsocketContext } from "../contexts/Contexts.js";
import useSessionStorage from '../hooks/useSessionStorage';
import SeeAs from '../components/SeeAs';
import Toast from '../components/Toast';
import { useTransition, animated } from '@react-spring/web';
import useToaster from '../hooks/useToaster';
import Offline from '../components/Offline';
import ResponsivePageSwitcher from '../components/ResponsivePageSwitcher';
import useWindowSize from '../hooks/useWindowSize';

const requestMessage = "Votre demande a bien été prise en compte."
const errorMessage = "Une erreur est survenue."
// const offlineMessage = "La connection au serveur est impossible. Veuillez réessayer plus tard."

let initialMount = true;

const AnimatedAdminMenu = animated(AdminMenu)

const Grid = ({ user }) => {

    const [isReady, sendData, getData] = useContext(WebsocketContext);

    const [grid, setGrid] = useSessionStorage("grid", null)
    const [teams, setTeams] = useSessionStorage("teams", null)

    const [selectedTeam, setSelectedTeam] = useState(user.isAdmin ? 0 : user.team)

    const [seeAsAdmin, setSeeAsAdmin] = useState(user.isAdmin)

    const [toasts, addToast] = useToaster()

    const windowSize = useWindowSize()

    // useEffect(() => {
    //     sendData("error", {
    //         data: "error"
    //     })
    // }, [])

    useEffect(() => {
        // if (isReady) {
        //     sendData("error", {
        //         data: "error"
        //     })
        // }
        if (initialMount) {
            initialMount = false
        }
    }, [isReady]);

    const handleTeamChange = (teamIndex) => {
        setSelectedTeam(teamIndex)
    }

    const handleClick = (teamIndex, goalIndex) => {
        const id = toasts.length ? toasts[toasts.length - 1].id + 1 : 0;
        if (isReady) {
            try {
                setTeams(teams.map((team) => team.index === teamIndex ? {
                    index: team.index,
                    grid: team.grid.map((cell, index) => index === goalIndex ? "pending" : cell),
                    progress: team.progress
                } : team))
                sendData("goalRequest", {
                    teamIndex: teamIndex,
                    goalIndex: goalIndex
                })
                addToast({
                    id: id,
                    icon: "check",
                    text: requestMessage,
                    timeout: 2000
                }, 2000)
            } catch (error) {
                addToast({
                    id: id,
                    icon: "cross",
                    text: errorMessage,
                    timeout: 2000
                }, 2000)
            }
        }
        // else {
        //     addToast({
        //         id: id,
        //         icon: "cross",
        //         text: offlineMessage,
        //         timeout: 2000
        //     }, 2000)
        // }
    }

    const handleSeeAsChange = () => {
        if (seeAsAdmin) {
            setSelectedTeam(user.team)
        }
        setSeeAsAdmin(!seeAsAdmin)
    }

    const [adminMenu, setAdminMenu] = useState((user.isAdmin && seeAsAdmin))

    const transition = useTransition(adminMenu, {
        from: { pointerEvents: "auto", marginLeft: initialMount ? "0" : "-300px" },
        enter: { pointerEvents: "auto", marginLeft: "0" },
        leave: { pointerEvents: "none", marginLeft: "-300px" },
        config: {
            duration: 100,
        }
    })
    // const transition = useTransition(adminMenu, {
    //     from: { pointerEvents: "auto", left: initialMount ? "0" : "-300px" },
    //     enter: { pointerEvents: "auto", left: "0" },
    //     leave: { pointerEvents: "none", left: "-300px" },
    //     config: {
    //         duration: 2000,
    //     }
    // })

    useEffect(() => {
        setAdminMenu(user.isAdmin && seeAsAdmin)
    }, [user.isAdmin, seeAsAdmin])

    return (
        <div className='grid'>
            <Header />
            <main className={(windowSize.height < windowSize.width * 1.1 && windowSize.width >= 620) ? 'grid-main normal' : 'grid-main short'}>
                {/* {adminMenu && <AnimatedAdminMenu teams={teams} gridSize={grid.size} handleTeamChange={handleTeamChange} selectedTeam={selectedTeam} />} */}
                {transition((style, item) =>
                    item && (windowSize.height < windowSize.width * 1.1 && windowSize.width >= 620) && <AnimatedAdminMenu screenSize='normal' style={style} teams={teams} gridSize={grid.size} handleTeamChange={handleTeamChange} selectedTeam={selectedTeam} />

                )}
                {/* {adminMenu && <AdminMenu teams={teams} gridSize={grid.size} handleTeamChange={handleTeamChange} selectedTeam={selectedTeam} />} */}
                <section className={(seeAsAdmin ? 'main-section admin' : 'main-section') + ((windowSize.height < windowSize.width * 1.1 && windowSize.width >= 620) ? ' normal' : ' short')}>
                    {transition((style, item) =>
                        item && (windowSize.height > windowSize.width * 1.1 || windowSize.width < 620) && <AdminMenu screenSize='short' style={style} teams={teams} gridSize={grid.size} handleTeamChange={handleTeamChange} selectedTeam={selectedTeam} />
                    )}
                    <div className='main-container'>
                        <h2>{teams ? "Team " + (teams.find(team => team.index === selectedTeam).index + 1) : ""}</h2>
                        <GridContainer isReady={isReady} team={teams ? teams.find(team => team.index === selectedTeam) : ""} grid={grid} key={selectedTeam} handleClick={handleClick} seeAsAdmin={seeAsAdmin} />
                        {(user.isAdmin && user.team) && <SeeAs seeAsAdmin={seeAsAdmin} handleSeeAsChange={handleSeeAsChange} />}
                        <Offline isReady={isReady} />
                    </div>
                    {user.team && <ul className='toast-container'>
                        {toasts.map((value) => (
                            <Toast value={value} key={value.id} />
                        ))}
                        {/* <li className='toast'></li>
                        <li className='toast'></li> */}
                    </ul>}
                </section>
            </main>
            <ResponsivePageSwitcher />
        </div>
    );
};

export default Grid;
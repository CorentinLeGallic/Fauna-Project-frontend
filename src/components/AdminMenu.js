import React, { useEffect, useState } from 'react';
import TeamsSorter from './TeamsSorter';

const AdminMenu = ({ teams, gridSize, handleTeamChange, selectedTeam, style, screenSize }) => {

    const [sortBy, setSortBy] = useState("index")
    const [sortedTeams, setSortedTeams] = useState(sortBy === "index" ? teams.sort((a, b) => {
        return a[sortBy] - b[sortBy];
    }) : teams.sort((a, b) => {
        return b[sortBy] - a[sortBy];
    }))

    // 

    const [isActive, setIsActive] = useState(true)

    const handleClick = (e) => {
        setIsActive(value => !value)
    }

    const getRank = (team) => {
        const progresses = teams.map((team) => { return team.progress; })
        const sortedProgresses = progresses.sort((a, b) => {
            return b - a;
        });
        return sortedProgresses.indexOf(team.progress) + 1
    }

    return (
        <section className={screenSize === "short" ? "admin-menu short" : "admin-menu normal"} style={style} >
            <div className='teams-header'>
                <button onClick={handleClick} className="left-teams-header">
                    <div className='dropdown-img'>
                        <img draggable="false" className={isActive ? 'active' : ''} src='./medias/dropdown.png' />
                    </div>
                    <h2>Teams</h2>
                </button>
                <TeamsSorter screenSize={screenSize} sortBy={sortBy} setSortBy={setSortBy} />
            </div>
            <div className={isActive ? 'team-list-container active' : 'team-list-container'}>
                <ul className={isActive ? 'teams-list active' : 'teams-list'}>
                    {sortedTeams.map((team, index) => (
                        <li key={index} className={selectedTeam === team.index ? 'team-item selected' : 'team-item'} onClick={() => handleTeamChange(team.index)}>
                            <div className="left-team-infos">
                                <span className='team-rank'>
                                    {getRank(team)}.
                                </span>
                                <span className='team-index'>
                                    {"Team " + (team.index + 1)}
                                </span>
                            </div>
                            <div className="right-team-infos">
                                <span className='team-progress'>{Math.round(team.progress * 100)}%</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section >
    );
};

export default AdminMenu;

{/* <div>
<div class="dropdown-heading">Courses</div>
<div class="dropdown-links">
  <a h="#" class="link">JavaScript</a>
  <a h="#" class="link">CSS</a>
  <a h="#" class="link">React</a>
</div>
</div> */}
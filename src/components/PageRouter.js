import React, { useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeamBuilder from "../pages/TeamBuilder";
import Grid from "../pages/Grid";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import useSessionStorage from "../hooks/useSessionStorage";
import { WebsocketContext } from "../contexts/Contexts.js";
import Unauthorized from "../pages/Unauthorized";

export default function PageRouter() {

  const [isReady, sendData, getData] = useContext(WebsocketContext);

  const [user, setUser] = useSessionStorage("user", null);
  const [gameStarted, setGameStarted] = useSessionStorage("gameStarted", null)
  const [grid, setGrid] = useSessionStorage("grid", null)
  const [teams, setTeams] = useSessionStorage("teams", null)

  useEffect(() => {
    if (isReady && user) {
      getData("gameStarted", (msg) => {
        setGameStarted(msg.data.gameStarted)
      })
      getData("grid", (msg) => {
        setGrid(msg.data.grid)
      })
      getData("cell", (msg) => {
        setTeams(teams.map((team) => team.index === msg.data.teamIndex ? {
          index: team.index,
          grid: team.grid.map((cell, index) => index === msg.data.cellIndex ? msg.data.cell : cell),
          progress: team.progress
        } : team))
      })
    }
  }, [isReady, user])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Auth />} key="auth" />,
        {user ?
          <>
            {gameStarted && <Route path="grid" element={<Grid user={user} key="grid" />} />},
            {(user.isAdmin && !gameStarted) && <Route path="teambuilder" element={<TeamBuilder />} key="teambuilder" />}
          </>
          : <Route path="unauthorized" element={<Unauthorized />} key="unauthorized" />
        }
        <Route path="*" element={<Home />} key="home" />,
      </Routes>
    </BrowserRouter>
  );
}

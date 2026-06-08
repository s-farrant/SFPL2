import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { GameweekProvider } from "./contexts/GameweekProvider.jsx";

import GlobalLayout from "./layouts/GlobalLayout";
import Layout from "./layouts/Layout";

import PWA from "./pages/PWA.jsx";
import Home from "./pages/Home";
import Team from "./pages/team/Team";
import Leagues from "./pages/leagues/Leagues";
import Players from "./pages/players/Players";
import Fixtures from "./pages/fixtures/Fixtures";
import Dreamteam from "./pages/dreamteam/Dreamteam";
import EnterManagerId from "./pages/EnterManagerId.jsx";

function App() {

    const [managerId, setManagerId] = useState(JSON.parse(localStorage.getItem("managerId")));
    console.log(managerId)

    const isInstalled = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

    if (!isInstalled) {
        return (
            <PWA />
        )
    }

    return (
        <GameweekProvider>
            { managerId ?
                <Routes>
                    <Route element={<GlobalLayout />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="/leagues" element={<Leagues />} />
                            <Route path="/players" element={<Players />} />
                            <Route path="/fixtures" element={<Fixtures />} />
                            <Route path="/dreamteam/:gameweekId" element={<Dreamteam />} />
                        </Route>
                    </Route>
                </Routes>

            : <EnterManagerId setManagerId={setManagerId} /> }
        </GameweekProvider>
    )
}

export default App
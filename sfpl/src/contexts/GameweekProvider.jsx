import { useState, useEffect, createContext, useContext } from "react";

import { apiFetch } from "../api.js";

import { GameweekContext } from "./GameweekContext.js";

export const useGameweek = () => useContext(GameweekContext);

export const GameweekProvider = ({ children }) => {
    const [gameweekId, setGameweekId] = useState(null);

    useEffect(() => {
        const updateGameweek = async () => {
            const currentGameweek = await apiFetch("/current-gameweek");
            setGameweekId(currentGameweek.id)
        };
        updateGameweek();
    }, []);

    return (
        <GameweekContext.Provider value={{ gameweekId, setGameweekId }}>
            {children}
        </GameweekContext.Provider>
    );
};
const { players } = require('../cache.js')

const express = require("express");

const playersRouter = express.Router();

playersRouter.get("/:id", async (req, res, next) => {

    const playerId = req.params.id;
    const gameweekId = req.query.gameweek;

    const r = await fetch(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`);
    const data = await r.json();

    const gameweekData = data["history"].find(gameweek => gameweek.round == gameweekId);

    let playerStatsArr = [];

    gameweekData.minutes == 0 ? null : playerStatsArr.push({ statName: "MP", value: gameweekData.minutes });
    gameweekData.goals_scored == 0 ? null : playerStatsArr.push({ statName: "G", value: gameweekData.goals_scored});
    gameweekData.assists == 0 ? null : playerStatsArr.push({ statName: "A", value: gameweekData.assists });
    if (players[String(playerId)].element_type < 4) {
        gameweekData.clean_sheets == 0 ? null : playerStatsArr.push({ statName: "CS", value: null });
    }
    if (players[String(playerId)].element_type < 3) {
        gameweekData.goals_conceded == 0 ? null : playerStatsArr.push({ statName: "GC", value: gameweekData.goals_conceded });
    }
    gameweekData.own_goals == 0 ? null : playerStatsArr.push({ statName: "OG", value: gameweekData.own_goals });
    gameweekData.penalties_saved == 0 ? null : playerStatsArr.push({ statName: "PS", value: gameweekData.penalties_saved });
    gameweekData.penalties_missed == 0 ? null : playerStatsArr.push({ statName: "PM", value: gameweekData.penalties_missed });
    gameweekData.yellow_cards == 0 ? null : playerStatsArr.push({ statName: "YC", value: null });
    gameweekData.red_cards == 0 ? null : playerStatsArr.push({ statName: "RC", value: null });
    gameweekData.saves == 0 ? null : playerStatsArr.push({ statName: "S", value: gameweekData.saves });
    if (players[String(playerId)].element_type >= 3) {
        gameweekData.defensive_contribution < 12 ? null : playerStatsArr.push({ statName: "DC", value: gameweekData.defensive_contribution });
    } else if (players[String(playerId)].element_type == 2) {
        gameweekData.defensive_contribution < 10 ? null : playerStatsArr.push({ statName: "DC", value: gameweekData.defensive_contribution });
    }

    gameweekData.bonus == 0 ? null : playerStatsArr.push({ statName: "BP", value: gameweekData.bonus });

    const playerStats = {
        name: players[String(playerId)].web_name,
        id: playerId,
        stats: playerStatsArr,
    }

    res.json(playerStats)

})

playersRouter.get("/:id/season", async (req, res, next) => {

    const playerId = req.params.id;

    const seasonData = players[String(playerId)];

    let playerStatsArr = [];

    seasonData.minutes == 0 ? null : playerStatsArr.push({ statName: "MP", value: seasonData.minutes });
    seasonData.goals_scored == 0 ? null : playerStatsArr.push({ statName: "G", value: seasonData.goals_scored });
    seasonData.assists == 0 ? null : playerStatsArr.push({ statName: "A", value: seasonData.assists });

    if (seasonData.element_type < 4) {
        seasonData.clean_sheets == 0 ? null : playerStatsArr.push({ statName: "CS", value: seasonData.clean_sheets });
    }

    if (seasonData.element_type == 1) {
        seasonData.penalties_saved == 0 ? null : playerStatsArr.push({ statName: "PS", value: seasonData.penalties_saved });
        seasonData.saves == 0 ? null : playerStatsArr.push({ statName: "S", value: seasonData.saves });
    }
    seasonData.bonus == 0 ? null : playerStatsArr.push({ statName: "BP", value: seasonData.bonus });

    const playerStats = {
        name: players[String(playerId)].web_name,
        id: playerId,
        stats: playerStatsArr,
    }

    res.json(playerStats)

})

module.exports = playersRouter;

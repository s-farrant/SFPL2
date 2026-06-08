const { players, positions, teams } = require('../cache.js')

const express = require("express");

const dreamteamRouter = express.Router();

let seasonDreamteam = null;

dreamteamRouter.get("/season", async (req, res, next) => {

    const dreamteamArray = Object.values(players).filter(player => {
        return player.in_dreamteam === true;
    })

    seasonDreamteam = dreamteamArray;

    const dreamteamObject = {
        gkp: [],
        def: [],
        mid: [],
        fwd: [],
        totalPoints: 0,
    };

    const topPlayer = dreamteamArray.reduce((max, player) => {
        return player.total_points > max.total_points ? player : max;
    });


    dreamteamObject.topPlayer = {
        webName: topPlayer.web_name,
        points: topPlayer.total_points,
        teamCode: topPlayer.team_code,
        teamName: teams[topPlayer.team_code].name,
        image: topPlayer.photo.split(".")[0]
    }

    dreamteamArray.forEach(player => {
        dreamteamObject.totalPoints += player.total_points
        switch (player.element_type) {
            case 1:
                dreamteamObject.gkp.push({
                    id: player.id,
                    name: player.web_name,
                    points: player.total_points,
                    team: player.team_code,
                    position: player.element_type,
                })
                break;
            case 2:
                dreamteamObject.def.push({
                    id: player.id,
                    name: player.web_name,
                    points: player.total_points,
                    team: player.team_code,
                    position: player.element_type,
                })
                break;
            case 3:
                dreamteamObject.mid.push({
                    id: player.id,
                    name: player.web_name,
                    points: player.total_points,
                    team: player.team_code,
                    position: player.element_type,
                })
                break;
            case 4:
                dreamteamObject.fwd.push({
                    id: player.id,
                    name: player.web_name,
                    points: player.total_points,
                    team: player.team_code,
                    position: player.element_type,
                })
                break;
        }
    })

    res.json(dreamteamObject);

})

dreamteamRouter.get("/:id", async (req, res, next) => {
    const gameweek = Number(req.params.id);

    const r = await fetch(`https://fantasy.premierleague.com/api/dream-team/${gameweek}/`);
    const data = await r.json();

    const dreamteam = {
        gkp: [],
        def: [],
        mid: [],
        fwd: [],
        totalPoints: 0,
    };

    dreamteam.topPlayer = {
        webName: players[data.top_player.id].web_name,
        points: data.top_player.points,
        teamCode: players[data.top_player.id].team_code,
        teamName: teams[players[data.top_player.id].team_code].name,
        image: players[data.top_player.id].photo.split(".")[0]
    }
    data.team.forEach(player => {
        dreamteam.totalPoints += player.points
        switch (players[player.element].element_type) {
            case 1:
                dreamteam.gkp.push({
                    id: player.element,
                    name: players[player.element].web_name,
                    points: player.points,
                    team: players[player.element].team_code,
                    position: players[player.element].element_type,
                })
                break;
            case 2:
                dreamteam.def.push({
                    id: player.element,
                    name: players[player.element].web_name,
                    points: player.points,
                    team: players[player.element].team_code,
                    position: players[player.element].element_type,
                })
                break;
            case 3:
                dreamteam.mid.push({
                    id: player.element,
                    name: players[player.element].web_name,
                    points: player.points,
                    team: players[player.element].team_code,
                    position: players[player.element].element_type,
                })
                break;
            case 4:
                dreamteam.fwd.push({
                    id: player.element,
                    name: players[player.element].web_name,
                    points: player.points,
                    team: players[player.element].team_code,
                    position: players[player.element].element_type,
                })
                break;
        }
    })
    res.json(dreamteam);

})

dreamteamRouter.get("/playerInfo/:id", async (req, res, next) => {

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

dreamteamRouter.get("/playerInfo/:id/season", async (req, res, next) => {

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

module.exports = dreamteamRouter;
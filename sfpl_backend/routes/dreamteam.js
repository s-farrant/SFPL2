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

module.exports = dreamteamRouter;
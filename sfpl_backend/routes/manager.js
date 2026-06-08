const { gameweek, events } = require('../cache.js')

const express = require("express");

const managerRouter = express.Router();

managerRouter.get("/:id/valid", async (req, res, next) => {
    const managerId = req.params.id;

    try {
        const r = await fetch(`https://fantasy.premierleague.com/api/entry/${managerId}/`);
        const data = await r.json();
    
        res.json({"valid": data.detail ? false : true})
    } catch {
        res.json({ "valid": false })
    }
})

managerRouter.get("/:id", async (req, res, next) => {
    const managerId = req.params.id;

    const r = await fetch(`https://fantasy.premierleague.com/api/entry/${managerId}/`);
    const data = await r.json();

    const r2 = await fetch(`https://fantasy.premierleague.com/api/entry/${managerId}/history/`);
    const data2 = await r2.json();

    const runningAverage = Object.values(events).reduce((total, event) => {
        return total + (event.average_entry_score || 0);
    }, 0);

    chips = {
        first: {
            "3xc": {
                status: "available"
            },
            bboost: {
                status: "available"
            },
            wildcard: {
                status: "available"
            },
            freehit: {
                status: "available"
            }
        },
        second: {
            "3xc": {
                status: "available"
            },
            bboost: {
                status: "available"
            },
            wildcard: {
                status: "available"
            },
            freehit: {
                status: "available"
            }
        }
    }

    data2.chips.forEach((chip) => {
        if (chip.event <= 19) {
            chip.event == gameweek.id ? chips.first[chip.name].status = "active" : chips.first[chip.name].status = "played"
            chips.first[chip.name].event = chip.event
        } else {
            chip.event == gameweek.id ? chips.second[chip.name].status = "active" : chips.second[chip.name].status = "played"
            chips.second[chip.name].event = chip.event
        }
    })

    managerInfo = {
        info: {
            id: data.id,
            teamName: data.name,
            gameweekPoints: data.summary_event_points,
            gameweekAveragePoints: events[gameweek.id].average_entry_score,
            overallPoints: data.summary_overall_points,
            overallAveragePoints: runningAverage,
        },
        chips: chips
    }

    res.json(managerInfo);

});

module.exports = managerRouter;
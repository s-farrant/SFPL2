const { players, positions, teamsById } = require('../cache.js')
const { getPicks, getLive, getFixtures, getTransfers } = require('../teamCache.js')

const express = require("express");

const teamRouter = express.Router();

teamRouter.get("/:managerId/:gameweekId", async (req, res, next) => {
    const managerId = req.params.managerId;
    const gameweekId = Number(req.params.gameweekId);

    const [picks, live, fixtures, transfers] = await Promise.all([
        getPicks(managerId, gameweekId),
        getLive(gameweekId),
        getFixtures(gameweekId),
        getTransfers(managerId),
    ]);

    const liveByElement = {};
    live.elements.forEach(element => {
        liveByElement[element.id] = element.stats;
    });

    const autoSubIds = new Set();
    (picks.automatic_subs || []).forEach(sub => {
        if (sub.event == gameweekId) {
            autoSubIds.add(sub.element_in);
            autoSubIds.add(sub.element_out);
        }
    });

    const buildFixtureInfo = (teamId) => {
        const legs = fixtures.filter(fixture => fixture.team_h === teamId || fixture.team_a === teamId);

        if (legs.length === 0) {
            return { fixture: "-", fixtureDifficulty: [], fixtureStarted: true };
        }

        const texts = [];
        const difficulties = [];
        let started = false;

        legs.forEach(leg => {
            const isHome = leg.team_h === teamId;
            const opponent = teamsById[isHome ? leg.team_a : leg.team_h];
            texts.push(`${opponent.short_name} (${isHome ? "H" : "A"})`);
            difficulties.push(isHome ? leg.team_h_difficulty : leg.team_a_difficulty);
            if (leg.started) started = true;
        });

        return { fixture: texts.join(" "), fixtureDifficulty: difficulties, fixtureStarted: started };
    };

    const buildPriceChange = (element) => {
        const player = players[element];

        const latestTransferIn = transfers
            .filter(transfer => transfer.element_in === element)
            .sort((a, b) => b.event - a.event)[0];

        const buyPrice = latestTransferIn
            ? latestTransferIn.element_in_cost
            : player.now_cost - player.cost_change_start;

        return player.now_cost - buyPrice;
    };

    const buildPlayerObj = (pick) => {
        const player = players[pick.element];
        const fixtureInfo = buildFixtureInfo(player.team);

        return {
            id: player.id,
            name: player.web_name,
            team: player.team_code,
            position: player.element_type,
            positionShort: positions[player.element_type]?.singular_name_short,
            points: (liveByElement[pick.element]?.total_points || 0) * pick.multiplier,
            armband: pick.is_captain ? "C" : pick.is_vice_captain ? "V" : null,
            isAutoSub: autoSubIds.has(pick.element),
            fixture: fixtureInfo.fixture,
            fixtureDifficulty: fixtureInfo.fixtureDifficulty,
            fixtureStarted: fixtureInfo.fixtureStarted,
            form: player.form,
            ictIndex: player.ict_index,
            selectedByPercent: player.selected_by_percent,
            priceChange: buildPriceChange(pick.element),
        };
    };

    const starting = picks.picks.filter(pick => pick.position <= 11).map(buildPlayerObj);
    const bench = picks.picks
        .filter(pick => pick.position >= 12)
        .sort((a, b) => a.position - b.position)
        .map(buildPlayerObj);

    const dreamteam = { gkp: [], def: [], mid: [], fwd: [] };
    starting.forEach(playerObj => {
        switch (playerObj.position) {
            case 1:
                dreamteam.gkp.push(playerObj);
                break;
            case 2:
                dreamteam.def.push(playerObj);
                break;
            case 3:
                dreamteam.mid.push(playerObj);
                break;
            case 4:
                dreamteam.fwd.push(playerObj);
                break;
        }
    });

    const totalPoints = picks.picks.reduce((total, pick) => {
        return total + (liveByElement[pick.element]?.total_points || 0) * pick.multiplier;
    }, 0);

    res.json({
        gkp: dreamteam.gkp,
        def: dreamteam.def,
        mid: dreamteam.mid,
        fwd: dreamteam.fwd,
        bench,
        totalPoints,
        activeChip: picks.active_chip,
    });
});

module.exports = teamRouter;

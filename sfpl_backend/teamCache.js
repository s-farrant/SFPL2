const { events } = require('./cache.js')

const picksCache = new Map();
const liveCache = new Map();
const fixturesCache = new Map();
const transfersCache = new Map();

const isFinished = (gw) => events[gw]?.finished === true;

const getPicks = async (managerId, gw) => {
    const key = `${managerId}-${gw}`;
    if (isFinished(gw) && picksCache.has(key)) return picksCache.get(key);

    const r = await fetch(`https://fantasy.premierleague.com/api/entry/${managerId}/event/${gw}/picks/`);
    const data = await r.json();

    if (isFinished(gw)) picksCache.set(key, data);
    return data;
}

const getLive = async (gw) => {
    if (isFinished(gw) && liveCache.has(gw)) return liveCache.get(gw);

    const r = await fetch(`https://fantasy.premierleague.com/api/event/${gw}/live/`);
    const data = await r.json();

    if (isFinished(gw)) liveCache.set(gw, data);
    return data;
}

const getFixtures = async (gw) => {
    if (isFinished(gw) && fixturesCache.has(gw)) return fixturesCache.get(gw);

    const r = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`);
    const data = await r.json();

    if (isFinished(gw)) fixturesCache.set(gw, data);
    return data;
}

const getTransfers = async (managerId) => {
    if (transfersCache.has(managerId)) return transfersCache.get(managerId);

    const r = await fetch(`https://fantasy.premierleague.com/api/entry/${managerId}/transfers/`);
    const data = await r.json();

    transfersCache.set(managerId, data);
    return data;
}

module.exports = { getPicks, getLive, getFixtures, getTransfers }

const players = {};
const positions = {};
const teams = {};
const teamsById = {};
const gameweek = {};
const events = {}

const bootstrapFetch = async () => {
    const r = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const bootstrapData = await r.json();

    bootstrapData.elements.forEach(player => {
        players[player.id] = player;
    });

    bootstrapData.element_types.forEach(position => {
        positions[position.id] = position;
    });

    bootstrapData.teams.forEach(team => {
        teams[team.code] = team;
        teamsById[team.id] = team;
    });

    bootstrapData.events.forEach(event => {
        events[event.id] = event
    });

    const currentGameweek = bootstrapData.events.find((event) => {
        return event.is_current == true;
    })

    gameweek.id = currentGameweek.id;
    gameweek.averageScore = currentGameweek.average_entry_score;
    gameweek.total = bootstrapData.events.length;

}

module.exports = { bootstrapFetch, players, positions, teams, teamsById, gameweek, events }
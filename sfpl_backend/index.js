const { bootstrapFetch, gameweek } = require("./cache.js");

const express = require('express');
const cors = require('cors');

setInterval(bootstrapFetch, 86400000);


const app = express();
const PORT = 3001;

const dreamteamRouter = require("./routes/dreamteam.js");
const managerRouter = require("./routes/manager.js");
const teamRouter = require("./routes/team.js");
const playersRouter = require("./routes/players.js");

app.use(cors());
app.use(express.json());

app.use("/dreamteam", dreamteamRouter);
app.use("/manager", managerRouter);
app.use("/team", teamRouter);
app.use("/players", playersRouter);

app.get("/current-gameweek", (req, res, next) => {
    res.json(gameweek);
})


const start = async () => {
    await bootstrapFetch();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

start();
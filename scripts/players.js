const apiDomain = process.env.API_DOMAIN;
const modules = require("./modules");

const players = () => {
    modules.app.get("/players", (req, res) => {
        const pageName = "Players", subDomain = "home";

        modules.axios.get(`https://${apiDomain}/get_player_count`)
            .then((response) => {
                const data = response.data;
                online = data.counts.online;
                total = data.counts.total;
                if (req.query.type === "online") {
                    res.send(`${online}`);
                }
                else {
                    res.send(`${total}`);
                }
            })
            .catch((error) => {
                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
            });
    });
}
module.exports = players;
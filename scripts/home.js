require("dotenv").config();
const API_DOMAIN = process.env.API_DOMAIN;
const modules = require("./modules");

const home = () => {
    modules.app.get("/home", (req, res) => {
        modules.axios.get(`${API_DOMAIN}/get_player_count`)
            .then((response) => {
                const data = response.data;
                const online = data.counts.online, total = data.counts.total;
                res.render("home.ejs", {
                    online, total
                });
            })
            .catch((error) => {
                modules.utils.writeError(error, res);
            });
    });
}
module.exports = home;
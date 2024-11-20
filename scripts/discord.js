const modules = require("./modules");

const discord = () => {
    const pageName = "Discord", subDomain = "discord";

    modules.app.get("/discord", (req, res) => {
        modules.utils.writeLog(req, res, "GET", subDomain);
        res.redirect("https://discord.com/invite/xqncGVrHSf");
    });
}
module.exports = discord;
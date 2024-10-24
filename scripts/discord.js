const modules = require("./modules");

const discord = () => {
    modules.app.get("/discord", (req, res) => {
        const pageName = "Discord", subDomain = "discord";
        
        modules.utils.writeLog(req, res, "GET", subDomain);
        res.redirect("https://discord.com/invite/xqncGVrHSf");
    });
}
module.exports = discord;
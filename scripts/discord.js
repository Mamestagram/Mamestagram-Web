const modules = require("./modules");

const discord = () => {
    const pageName = "Discord", subDomain = "discord";

    modules.app.get(`/${subDomain}`, (req, res) => {
        modules.utils.writeLog(req, res, "GET", subDomain);
        res.redirect("https://discord.com/invite/xqncGVrHSf");
    });
}
module.exports = discord;
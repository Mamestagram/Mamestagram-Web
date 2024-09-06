const modules = require("./modules");

const home = () => {
    modules.app.get("/", (req, res) => {
        res.redirect("/home");
    });
}
module.exports = home;
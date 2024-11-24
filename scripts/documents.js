const modules = require("./modules");
const functions = require("./modules/functions");

const documents = () => {
    const pageName = "Documents", subDomain = "documents";

    modules.app.get(`/${subDomain}`, (req, res) => {
        res.render("documents.ejs",
            {},
            (error, ejs) => {
                if (error) {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                }
                else {
                    modules.utils.writeLog(req, res, "GET", subDomain);
                    res.send(ejs);
                }
            }
        );
    });
}
module.exports = documents;
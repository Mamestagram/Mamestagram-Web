const modules = require("./modules");
const functions = require("./modules/functions");

const documents = () => {
    modules.app.get("/documents", (req, res) => {
	const pageName = "Documents", subDomain = "documents";
        console.log(res.locals.developer, res.locals.contributor, res.locals.moderator, res.locals.nominator);
        res.render(`${res.locals.language}/documents.ejs`, { functions },
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
const modules = require("./modules");
const contents = require(`./lang/documents`);

const documents = () => {
    const pageName = "Documents", subDomain = "documents";

    modules.app.get("/documents", (req, res) => {
        res.render(`documents.ejs`,
            { contents: contents[req.session.language] },
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
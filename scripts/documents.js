const modules = require("./modules");
const pageName = "Documents";

const documents = () => {
    modules.app.get("/documents", (req, res) => {
        res.render(`${res.locals.language}/documents.ejs`, {
            pageTitle: pageName
        });
    });
}
module.exports = documents;
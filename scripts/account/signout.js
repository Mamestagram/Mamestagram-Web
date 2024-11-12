const modules = require("../modules");

const signout = () => {
    const pageName = "Sign out", subDomain = "signout"

    modules.app.get("/signout", (req, res) => {
        if (res.locals.isLoggedIn) {
            req.session.destroy((err) => {
                if (err) {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, err, `ID: ${req.session.userid}`), subDomain);
                }
                res.locals.isLoggedIn = false;
                modules.utils.writeLog(req, res, "GET", subDomain);
                res.send(`
                    <script>
                        alert("Successfully signed out.");
                        window.location.href = "/";
                    </script>
                `);
            });
        }
        else {
            res.redirect("/");
        }
    });
}
module.exports = signout;
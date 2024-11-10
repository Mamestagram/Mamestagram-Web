const modules = require("./modules");

const account = () => {
    /*
    ?class=register: アカウント登録
    ?class=signin: ログイン
    ?class=settings: 設定
    */
    modules.app.get("/account", (req, res) => {
        let pageName;
        const subDomain = "account";
        switch (req.query.class) {
            case "register":
                pageName = "Register";
                break;
            case "signin":
                pageName = "Sign in";
                break;
            case "settings":
                pageName = "Settings";
                break;
        }

        res.render(`${res.locals.language}/account.ejs`, {
                type: req.query.class,
                errLi: { username: [], email: [], password: [], hf: false, bot: false },
                name: null,
                email: null,
                password: null
            },
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
module.exports = account;
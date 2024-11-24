const modules = require("./modules");

const account = () => {
    /*
    ?class=register: アカウント登録
    ?class=signin: ログイン
    ?class=verify: アカウント認証
    ?class=code: コード認証
    ?class=settings: 設定
    */
    let pageName, subDomain = "account";

    modules.app.get("/account",
        (req, res, next) => {
            if ((req.query.class === "register" || req.query.class === "signin") && res.locals.isLoggedIn) {
                res.redirect("/");
            }
            else if (req.query.class === "settings" && !res.isLoggedIn) {
                res.redirect("/account?class=signin");
            }
            else {
                next();
            }
        },
        (req, res) => {
            switch (req.query.class) {
                case "register":
                    pageName = "Register";
                    subDomain += "&register";
                    break;
                case "signin":
                    pageName = "Sign in";
                    subDomain += "&signin";
                    break;
                case "verify":
                    pageName = "Verification";
                    subDomain += "&verify";
                    break;
                case "code":
                    pageName = "Verification";
                    subDomain += "&code";
                    break;
                case "settings":
                    pageName = "Settings";
                    subDomain += "&settings";
                    break;
            }

            res.render("account.ejs", {
                    type: req.query.class,
                    errLi: { username: [], email: [], hf: false, bot: false },
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
        }
    );
}
module.exports = account;
require("dotenv").config();
const modules = require("./scripts/modules");
const mysql = require("./scripts/modules/mysql");
const home = require("./scripts/home");

const register = require("./scripts/account/register");
const signin = require("./scripts/account/signin");
const signout = require("./scripts/account/signout");

function connectMysql() {
    mysql.pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            setTimeout(connectMysql, 100);
        }
        else {
            console.log(`MySQL is connected as id ${connection.threadId}`);
            connection.release();
        }
    });
}
connectMysql();

// 初期設定
modules.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.locals.currentTime = new Date().toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).replaceAll("/", "").replaceAll(" ", "").replaceAll(":", "");
    next();
});

// ログイン情報設定
modules.app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.isLoggedIn = true;
        res.locals.userid = req.session.userid;
        res.locals.username = req.session.username;
        res.locals.country = req.session.country;
        res.locals.timeZone = req.session.timeZone;
        res.locals.badge = req.session.badge;
        res.locals.language = req.session.language;
    }
    else {
        res.locals.isLoggedIn = false;
        res.locals.userid = null;
        res.locals.username = null;
        res.locals.country = null;
        res.locals.timeZone = null;
        res.locals.badge = 0;
        res.locals.language = "en";
    }
    next();
});

modules.app.get("/", (req, res) => {
    res.redirect("/home");
});

// ホームページ
home();


// アカウント関連
register(); // 登録
signin(); // ログイン
signout(); // ログアウト

modules.app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

modules.app.listen(5000, () => {
    console.log("Ready to acccess the Mamestagram Web");
});
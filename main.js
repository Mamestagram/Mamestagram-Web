require("dotenv").config();
const apiDomain = process.env.API_DOMAIN, baseDomain = process.env.BASE_DOMAIN, recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY;
const modules = require("./scripts/modules");
const mysql = require("./scripts/modules/mysql");
const functions = require("./scripts/modules/functions");

const home = require("./scripts/home");
const leaderboard = require("./scripts/leaderboard");
const documents = require("./scripts/documents");
const discord = require("./scripts/discord");

const account = require("./scripts/account");
const register = require("./scripts/account/register");
const signin = require("./scripts/account/signin");
const signout = require("./scripts/account/signout");
const verify = require("./scripts/account/verify");

const connectMysql = () => {
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
    res.locals.apiDomain = apiDomain;
    res.locals.baseDomain = baseDomain;
    res.locals.recaptchaSiteKey = recaptchaSiteKey;
    res.locals.functions = functions;
    const connectMysql = () => {
        mysql.pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                setTimeout(connectMysql, 100);
            }
            else {
                const process = async () => {
                    try {
                        const developer = await mysql.query(
                            connection,
                            `
                            SELECT *
                            FROM users
                            WHERE priv & 1 << 14;
                            `
                        );
                        const contributor = await mysql.query(
                            connection,
                            `
                            SELECT *
                            FROM users
                            WHERE NOT priv & 1 << 14
                            AND priv & 1 << 5;
                            `
                        );
                        const moderator = await mysql.query(
                            connection,
                            `
                            SELECT *
                            FROM users
                            WHERE NOT priv & 1 << 14
                            AND priv & 1 << 12;
                            `
                        );
                        const nominator = await mysql.query(
                            connection,
                            `
                            SELECT *
                            FROM users
                            WHERE NOT priv & 1 << 14
                            AND priv & 1 << 11;
                            `
                        );
                        res.locals.developer = developer;
                        res.locals.contributor = contributor;
                        res.locals.moderator = moderator;
                        res.locals.nominator = nominator;
                    }
                    catch (error) {
                        modules.utils.writeError(req, res, modules.utils.getErrorContent("Main program", error));
                    }
                    finally {
                        connection.release();
                        next();
                    }
                }
                process();
            }
        });
    }
    connectMysql();
});

// ログイン情報設定
modules.app.use((req, res, next) => {
    if ((req.session.userid) !== undefined) {
        res.locals.isLoggedIn = true;
        res.locals.userid = req.session.userid;
        res.locals.username = req.session.username;
        res.locals.country = req.session.country;
        res.locals.timeZone = req.session.timeZone;
    }
    else {
        res.locals.isLoggedIn = false;
        req.session.favMode = 0;
        req.session.badge = 0;
        req.session.language = "en";
    }
    res.locals.favMode = req.session.favMode;
    res.locals.badge = req.session.badge;
    res.locals.language = req.session.language;
    next();
});

modules.app.get("/", (req, res) => {
    res.redirect("/home");
});

// ホームページ
home();

// リーダーボード
leaderboard();

// ドキュメント
documents();

// Discord
discord();

// ドキュメント
documents();

// アカウント関連
account(); // アカウント
register(); // 登録
signin(); // ログイン
signout(); // ログアウト
verify(); // アカウント認証

modules.app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

modules.app.listen(5000, () => {
    console.log("Ready to acccess the Mamestagram Web");
});
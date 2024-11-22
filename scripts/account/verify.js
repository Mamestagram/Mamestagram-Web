const sakuraMail = process.env.SAKURA_MAIL;
const modules = require("../modules");
const mysql = require("../modules/mysql");

const verify = () => {
    const pageName = "Verification", subDomain = "verify";
    const from = `Mamestagram Support <${sakuraMail}>`;
    let email, errLi, mailOptions, name, to, code, key, contents, time, user;

    modules.app.post("/verify",
        (req, res, next) => {
            if (req.query.key === undefined) {
                if (!res.locals.isLoggedIn) {
                    email = req.body.email;
                    errLi = { username: [], email: [], password: [], hf: false, bot: false };
                    const connectMysql = () => {
                        mysql.pool.getConnection((err, connection) => {
                            if (err) {
                                console.error(err);
                                setTimeout(connectMysql, 100);
                            }
                            else {
                                name = "ばっしぃー";
                                to = email;
                                next();
                                /*
                                const process = async () => {
                                    try {
                                        user = await mysql.query(
                                            connection,
                                            `
                                                SELECT name
                                                FROM users
                                                WHERE email = ?;
                                            `,
                                            [email]
                                        );
                                        if (user.length > 0) {
                                            name = user[0].name;
                                            to = email;
                                        }
                                        else {
                                            errLi.email.push("Does not exist");
                                            res.render(`${res.locals.language}/account.js`, {
                                                    type: "verify",
                                                    errLi,
                                                    name: null,
                                                    email,
                                                    password: null
                                                },
                                                (error, ejs) => {
                                                    if (error) {
                                                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                                                    }
                                                    else {
                                                        res.send(ejs);
                                                    }
                                                }
                                            );
                                        }
                                    }
                                    catch (error) {
                                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                                    }
                                    finally {
                                        connection.release();
                                        res.redirect("/login");
                                        //next();
                                    }
                                }
                                process();
                                */
                            }
                        });
                    }
                    connectMysql();
                }
                else {
                    const connectMysql = () => {
                        mysql.pool.getConnection((err, connection) => {
                            if (err) {
                                console.error(err);
                                setTimeout(connectMysql, 100);
                            }
                            else {
                                const process = async () => {
                                    try {
                                        user = await mysql.query(
                                            connection,
                                            `
                                                SELECT email
                                                FROM users
                                                WHERE id = ?;
                                            `,
                                            [res.locals.userid]
                                        );
                                        name = res.locals.username;
                                        to = user[0].email;
                                    }
                                    catch (error) {
                                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
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
                }
            }
            else {
                next();
            }
        },
        (req, res, next) => {
            if (req.query.key === undefined) {
                code = modules.crypto.randomBytes(8).toString("base64"); // 認証コード
                key = modules.crypto.createHash("sha512").update(code).digest("base64"); // 認証キー
                contents = modules.sakuraMail.contents(name, code, key, res.locals.language);
                mailOptions = {
                    from,
                    to,
                    subject: contents.title,
                    html: contents.body,
                };
                modules.sakuraMail.transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.log(info);
                    }
                    res.redirect("/");
                });
            }
            else {
                next();
            }
        },
        (req, res) => {

        }
    );
}
module.exports = verify;
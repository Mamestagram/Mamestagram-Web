const sakuraMail = process.env.SAKURA_MAIL;
const modules = require("../modules");
const mysql = require("../modules/mysql");

const verify = () => {
    const pageName = "Verification", subDomain = "verify";
    const from = `support@${sakuraMail}`;
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
                                        next();
                                    }
                                }
                                process();
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
                code = Math.random().toString(36).substring(2); // 認証コード
                key = modules.crypto.createHash("md5").update(code).digest("hex"); // 認証キー
                contents = sakuraMail.contents(name, code, key, res.locals.language);
                mailOptions = {
                    from,
                    to,
                    subject: contents.title,
                    text: contents.body
                };
                const process = async () => {
                    try {
                        const sendResult = await sakuraMail.transport.sendMail(mailOptions);
                        if (sendResult.flag) {

                        }
                        else {

                        }
                    }
                    catch (error) {
                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                    }
                }
                process();
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
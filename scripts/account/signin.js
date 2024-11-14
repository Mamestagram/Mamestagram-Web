const modules = require("../modules");
const mysql = require("../modules/mysql");

const signin = () => {
    const pageName = "Sign in", subDomain = "signin"
    let name, password, pass_hash, errLi, user;

    modules.app.post("/signin",
        (req, res, next) => {
            name = req.body.username;
            password = req.body.password;
            pass_hash = modules.crypto.createHash("md5").update(req.body.password).digest("hex");
            next();
        },
        (req, res, next) => {
            errLi = { username: [], email: [], password: [], hf: false, bot: false }
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
                                        SELECT u.id, country, timezone, language, preferred_mode, set_badge, pw_bcrypt
                                        FROM users u
                                        JOIN timezone tz
                                        ON country = code
                                        JOIN gacha_stats g_s
                                        ON g_s.id = u.id
                                        WHERE name = ?
                                        OR email = ?;
                                    `,
                                    [name, name]
                                );
                                if (user.length > 0) {
                                    const isMatch = modules.bcrypt.compareSync(pass_hash, user[0].pw_bcrypt);
                                    if (!isMatch) {
                                        errLi.username.push("Username or password is incorrect");   
                                    }
                                }
                                else {
                                    errLi.username.push("Username or password is incorrect");
                                }
                            }
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}`), subDomain);
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
        },
        (req, res) => {
            if (errLi.username.length <= 0 && errLi.password.length <= 0) {
                req.session.userid = user[0].id;
                req.session.username = name;
                req.session.country = user[0].country;
                req.session.timeZone = user[0].timezone;
                req.session.favMode = user[0].preferred_mode;
                req.session.badge = user[0].set_badge;
                req.session.language = user[0].language;
                modules.utils.writeLog(req, res, "POST (Succeeded)", subDomain);
                res.send(`
                    <script>
                        alert("Successfully signed in!");
                        window.location.href = "/";
                    </script>
                `);
            }
            else {
                res.render(`${res.locals.language}/account.ejs`, {
                    type: "signin",
                    errLi,
                    name,
                    email: null,
                    password
                },
                (error, ejs) => {
                    if (error) {
                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}`), subDomain);
                    }
                    else {
                        modules.utils.writeLog(req, res, "POST (Failed)", subDomain)
                        res.send(ejs);
                    }
                });
            }
        }
    );
}
module.exports = signin;
const geoApiKey = process.env.GEO_API_KEY;
const modules = require("../modules");
const mysql = require("../modules/mysql");

const signin = () => {
    const pageName = "Sign in", subDomain = "signin"
    let name = null, password = null, pass_hash = null, errLi = null, user;

    modules.app.get("/signin", (req, res) => {
        res,render(`${res.locals.language}/signin.ejs`, {
            errLi,
            name,
            password
        }, 
        (error, ejs) => {
            if (error) {
                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
            }
            else {
                modules.utils.writeLog(req, res, "GET", subDomain);
                res.send(ejs);
            }
        });
    });

    modules.app.post("/signin",
        (req, res, next) => {
            name = req.body.name;
            password = req.body.password;
            pass_hash = modules.crypto.createHash("md5").update(req.body.password).digest("hex")
            next();
        },
        (req, res, next) => {
            const connectMysql = () => {
                mysql.pool.getConnection((err, connection) => {
                    try {
                        if (err) {
                            console.error(err);
                            setTimeout(connectMysql, 100);
                        }
                        else {
                            const process = async () => {
                                user = await mysql.query(
                                    connection,
                                    `
                                    SELECT u.id, country, timezone, language, set_badge, pw_bcrypt
                                    FROM users u
                                    JOIN timezone tz
                                    ON country = code
                                    JOIN gacha_stats g_s
                                    ON g_s.id = u.id
                                    WHERE name = ?;
                                    `,
                                    [name]
                                );
                                if (getUser.length > 0) {
                                    const isMatch = modules.bcrypt.compareSync(pass_hash, getUser[0].pw_bcrypt);
                                    if (!isMatch) {
                                        errLi = "wrong";   
                                    }
                                }
                                else {
                                    errLi = "wrong";
                                }
                            }
                            process();
                            connection.release();
                        }
                    }
                    catch (error) {
                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}`), subDomain);
                    }
                });
            }
            connectMysql();
            next();
        },
        (req, res) => {
            if (errLi !== null) {
                req.session.userid = user[0].id;
                req.session.username = name;
                req.session.country = user[0].country;
                req.session.timeZone = user[0].timezone;
                req.session.badge = user[0].set_badge;
                req.session.language = user[0].language;
                modules.writeLog(req, res, "POST (Succeeded)", subDomain);
                res.send(`
                    <script>
                        alert("Successfully signed in!");
                        window.location.href = "/";
                    </script>
                `);
            }
            else {
                res.render(`${res.locals.language}/signin.ejs`, {
                    errLi,
                    name,
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
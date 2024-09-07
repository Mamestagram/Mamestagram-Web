const geoApiKey = process.env.GEO_API_KEY;
const modules = require("../modules");
const mysql = require("../modules/mysql");
const sql = require("sql-template-strings");

const signin = () => {
    const pageName = "Sign in", subDomain = "signin"
    let name = null, password = null, pass_hash = null, errLi = null;

    modules.app.get("/signin", (req, res) => {
        res,render("signin.ejs", {
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
                                const getUser = await mysql.query(
                                    connection, sql`
                                    SELECT u.id, country, set_badge, pw_bcrypt
                                    FROM users u
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
            modules.axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${modules.utils.getIP(req)}`)
                .then((response) => {
                    const data = response.data;
                    if (errLi !== null) {
                        req.session.userid = getUser[0].id;
                        req.session.username = name;
                        req.session.country = getUser[0].country;
                        req.session.timeZone = data.time_zone.name;
                        req.session.badge = getUser[0].set_badge;
                        modules.writeLog(req, res, "POST (Succeeded)", subDomain);
                        res.send(`
                            <script>
                                alert("Successfully signed in!");
                                window.location.href = "/";
                            </script>
                        `);
                    }
                    else {
                        res.render("signin.ejs", {
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
                })
                .catch((error) => {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}`), subDomain);
                });
        }
    );
}
module.exports = signin;
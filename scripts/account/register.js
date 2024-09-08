const recapthaSecretKey = process.env.RECAPTCHA_SECRET_KEY, geoApiKey = process.env.GEO_API_KEY;
const modules = require("../modules");
const mysql = require("../modules/mysql");

const register = () => {
    const pageName = "Register", subDomain = "register";
    let name = null, email = null, password = null, pass_confirm = null,  errLi = [], isClicked = false, time;

    modules.app.get((req, res) => {
        res.render("register.ejs", {
            errLi,
            name,
            emain,
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

    modules.app.post(
        (req, res, next) => {
            name = req.body.name;
            email = req.body.email;
            password = req.body.password;
            pass_confirm = req.body.confirm;
            next();
        },
        (req, res, next) => {
            time = 0;
            if (!isClicked) {
                clicked = true;
                const timer = setInterval(() => {
                    if (time >= 10) {
                        clicked = false;
                        clearInterval(timer);
                    }
                }, 1000);
                next();
            }
            else {
                time = 0;
                errLi.push("wait");
                res.render("register.ejs", {
                    errLi,
                    name,
                    email,
                    password
                },
                (error, ejs) => {
                    if (error) {
                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`));
                    }
                    else {
                        modules.utils.writeLog(req, res, "POST (Failed)", subDomain);
                        res.send(ejs);
                    }
                });
            }
        },
        (req, res, next) => {
            connnectMysql = () => {
                mysql.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error(err)
                        setTimeout(connnectMysql, 100);
                    }
                    else {
                        const process = async () => {
                            try {
                                const getBanWords = await mysql.query(
                                    connecrion, 
                                    `
                                    SELECT word
                                    FROM banword;
                                    `
                                );
                                const banWords = getBanWords.map((row) => row.word);
                                if (name.includes(banWords)) {
                                    errLi.push("banword");
                                }
                            }
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                            }
                        }
                        process();
                        connection.release();
                    }
                });
            }
            connnectMysql();
            next();
        },
        (req, res, next) => {
            const connectMysql = () => {
                mysql.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error(err);
                        setTimeout(connectMysql, 100);
                    }
                    else {
                        const process = async () => {
                            try {
                                const getNames = await mysql.query(
                                    connection,
                                    `
                                    SELECT id
                                    FROM user
                                    WHERE name = ?;
                                    `,
                                    [name]
                                );
                                const getEmails = await mysql.query(
                                    connection,
                                    `
                                    SELECT id
                                    FROM user
                                    WHERE email = ?;
                                    `,
                                    [email]
                                );
                                if (getNames.length > 0) {
                                    errLi.push("dupname");
                                }
                                if (getEmails.length > 0) {
                                    errLi.push("dupemail");
                                }
                            }
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                            }
                        }
                        process();
                        connection.release();
                    }
                });
            }
            connectMysql();
            next();
        },
        (req, res, next) => {
            if (password === pass_confirm) {
                next();
            }
            else {
                errLi.push("wrongconf");
            }
        },
        (req, res, next) => {
            if (errLi.length <= 0) {
                errLi = [];
                next();
            }
            else {
                res.render("register.ejs", {
                    errLi,
                    name,
                    email,
                    password
                },
                (error, ejs) => {
                    if (error) {
                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                    }
                    else {
                        modules.utils.writeLog(req, res, "POST (Failed)", subDomain);
                        res.send(ejs);
                    }
                });
            }
        },
        (req, res, next) => {
            modules.axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${recapthaSecretKey}&response=${req.body.recaptcha}`)
                .then((response) => {
                    const data = response.data;
                    const success = data.success, score = data.score;
                    if (success && score >= 0.9) {
                        next();
                    }
                    else {
                        errLi.push("recaptcha");
                        res.render("register.ejs", {
                            errLi,
                            name,
                            email,
                            password
                        },
                        (error, ejs) => {
                            if (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}\nSuccess: ${success}\nScore: ${score}`), subDomain);
                            }
                            else {
                                modules.utils.writeLog(req, res, "POST (Failed)", subDomain);
                                res.send(ejs);
                            }
                        });
                    }
                })
                .catch((error) => {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                });
        },
        (req, res) => {
            modules.axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${modules.utils.getIP(req)}`)
                .then((response) => {
                    const data = response.data;
                    const pass_hash = modules.crypto.createHash("md5").update(password).degest("hex").modules.bcrypt, safeName = modules.utils.getSafeName(name), country = data.country_code2.toLowerCase();
                    pass_hash = modules.bcrypt.hashSync(pass_hash, 12);
                    const connectMysql = () => {
                        mysql.pool.getConnection((err, connection) => {
                            if (err) {
                                console.error(err);
                                setTimeout(connectMysql, 100);
                            }
                            else {
                                const process = async () => {
                                    try {
                                        const getId = await mysql.query(
                                            connection, sql`
                                            SELECT id
                                            FROM users
                                            ORDER BY id DESC
                                            LIMIT 1;
                                            `
                                        );
                                        const userid = getId[0].id + 1;
                                        // usersに追加
                                        await mysql.query(
                                            conneciton, sql`
                                            INSERT INTO users (id, name, safe_name, email, priv, pw_bcrypt, country, creation_time)
                                            VALUES (?, ?, ?, ?, 3, ?, ?, UNIX_TIMESTAMP(NOW()));
                                            `,
                                            [userid, name, safeName, email, pass_hash, country]
                                        );
                                        // statsに追加
                                        for (let i = 0; i <= 8; i++) {
                                            if (i !== 7) {
                                                await mysql.query(
                                                    connection, sql`
                                                    INSERT INTO stats (id, mode)
                                                    VALUES (?, ?);
                                                    `,
                                                    [userid, i]
                                                );
                                            }
                                        }
                                        // dan_statsに追加
                                        for (let i = 0; i <= 3; i++) {
                                            switch (i) {
                                                case 0:
                                                case 1:
                                                    for (let j = 0; j <= 1; j++) {
                                                        await mysql.query(
                                                            connection, sql`
                                                            INSERT INTO dan_stats (id, type, mode, cs)
                                                            VALUES (?, ?, ?, 0);
                                                            `,
                                                            [userid, j, i]
                                                        );
                                                    }
                                                    break;
                                                case 3:
                                                    let cs;
                                                    for (let j = 0; j < 14; j++) {
                                                        if (j >= 0 && j <= 4) { cs = 4; }
                                                        else if (j <= 8) { cs = 6; }
                                                        else if (j <= 12) { cs = 7; }
                                                        else { cs = 10; }
                                                        await mysql.query(
                                                            connection, sql`
                                                            INSERT INTO dan_stats (id, type, mode, cs)
                                                            VALUES (?, ?, ?, ?);
                                                            `,
                                                            [userid, j, i, cs]
                                                        );
                                                    }
                                                    break;
                                                default:
                                                    await mysql.query(
                                                        connection, sql`
                                                        INSERT INTO dan_stats (id, type, mode, cs)
                                                        VALUES (?, 0, ?, 0);
                                                        `,
                                                        [userid, i]
                                                    );
                                            }
                                            // gacha_statsに追加
                                            await mysql.query(
                                                connection, sql`
                                                INSERT INTO gacha_stats (id, had_badge)
                                                VALUES (?, 0);
                                                `,
                                                [userid]
                                            );
                                            modules.utils.writeLog(req, res, "POST (Succeeded)", subDomain);
                                            res.send(
                                                `
                                                <script>
                                                    alert("Successfully registered your account!");
                                                    location.href = "/login";
                                                </script>
                                                `
                                            );
                                        }
                                    }
                                    catch (error) {
                                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                                    }
                                }
                                process();
                                connection.release();
                            }
                        });
                    }
                    connectMysql();
                })
                .catch((error) => {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                });
        }
    );
}
module.exports = register;
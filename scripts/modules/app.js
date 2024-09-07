const host = process.env.DB_HOST, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB_NAME, port = process.env.DB_PORT;
const express = require("express");
const session = require("express-session");
const mySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const sessionStore = new mySQLStore({ host, user, password, database, port });
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.static("styles"));
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: false,
        store: sessionStore,
        cookie: { 
            secure: false,
            maxAge: 12 * 30 * 24 * 60 * 60 * 1000
        }
    })
);
module.exports = app;
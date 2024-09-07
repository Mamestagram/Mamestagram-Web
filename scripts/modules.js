const app = require("./modules/app");
const utils = require("./modules/utils");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
module.exports = {
    app,
    utils,
    crypto,
    bcrypt,
    fs,
    axios,
    multer,
    path
};
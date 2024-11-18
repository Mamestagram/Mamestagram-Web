const sakuraMail = process.env.SAKURA_MAIL;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: sakuraMail,
    port: 587,
    secure: true,
    requireTLS: false
});
module.exports = transporter;
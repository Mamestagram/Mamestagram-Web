const baseDomain = process.env.BASE_DOMAIN, sakuraMail = process.env.SAKURA_MAIL, sakuraMailUser = process.env.SAKURA_MAIL_USER, sakuraMailPass = process.env.SAKURA_MAIL_PASS;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: sakuraMailUser,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: sakuraMail,
        pass: sakuraMailPass
    },
    logger: true,
    debug: true
});
const contents = (name, code, key, lang) => {
    const signature =
        `
        --<br>
        Mamestagram : https://web.mamesosu.net
        `;
    const text = {
        en: {
            title: "Mamestagram account verification",
            body:
                `
                Hello${name !== null ? `, ${name}` : ""}!<br>
                Thank you for playing on Mamestagram!<br>
                <br>
                An action performed requires verification.<br>
                <br>
                Your Verification code is: <strong>${code}</strong><br>
                Use this to authenticate your account.<br>
                <br>
                Alternatively, you can also visit this link below to finish verification:<br>
                <br>
                https://web.${baseDomain}/verify?key=${key}<br>
                <br>
                If you did not request this, please reply to administrators <strong>IMMEDIATELY</strong> as your account may be in danger.<br>
                <br>
                ${signature}
                `
        },
        jp: {
            title: "Mamestagramアカウント認証",
            body:
                `
                ${name !== null ? `${name}さん、` : ""}こんにちは!<br>
                Mamestagramで遊んでいただき本当にありがとうございます!<br>
                <br>
                あなたはアカウント認証が必要な操作をしました。<br>
                <br>
                認証コードは、 <strong>${code}</strong>  です。<br>
                これを使用してアカウントの認証を行ってください。<br>
                <br>
                また、下記のリンクへアクセスして認証することもできます。<br>
                <br>
                https://web.${baseDomain}/verify?key=${key}<br>
                <br>
                もしもこのリクエストに身に覚えがない場合、アカウントが不正利用されている可能性があるので<strong>早急</strong>に運営へご返信ください。<br>
                <br>
                ${signature}
                `
        }
    }
    return text[lang];
}
module.exports = {
    transporter,
    contents,
};
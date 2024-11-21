const baseDomain = process.env.BASE_DOMAIN, sakuraMail = process.env.SAKURA_MAIL;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: sakuraMail,
    port: 587,
    secure: true,
    requireTLS: false
});
const contents = (name, code, key, lang) => {
    const text = {
        en: {
            title: "Mamestagram account verification",
            body: `Hello${name !== null ? `, ${name}` : ""}!
            Thank you for playing on Mamestagram!
                        
            An action performed requires verification.
                        
            Your Verification code is: ${code}
            Use this to authenticate your account.                    
                        
            Alternatively, you can also visit this link below to finish verification:
                        
            https://web.${baseDomain}/verify?key=${key}
                        
            If you did not request this, please REPLY TO ADMINISTRATORS IMMEDIATELY as your account may be in danger.
                        
            --------------------------------------
            Mamestagram : https://web.${baseDomain}
            --------------------------------------`
        },
        ja: {
            title: "Mamestagramアカウント認証",
            body: `${name !== null ? `, ${name}さん、` : ""}こんにちは!
            Mamestagramで遊んでいただき本当にありがとうございます!
            
            あなたはアカウント認証が必要な操作をしました。
            
            認証コードは、 ${code}  です。
            これを使用してアカウントの認証を行ってください。
            
            また、下記のリンクへアクセスして認証することもできます。
            
            https://web.${baseDomain}/verify?key=${key}
            
            もしもこのリクエストに身に覚えがない場合、アカウントが不正利用されている可能性があるので早急に運営へご返信ください。
            
            --------------------------------------
            Mamestagram : https://web.${baseDomain}
            --------------------------------------`
        }
    }
    return text[lang];
}
module.exports = {
    transporter,
    contents,
};
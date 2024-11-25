const contents = {
    en: {
        title: "Dashboard",
        pageName: "Home Page",
        text: [
            `
            Welcome to <span>Mamestagram</span>! This is a private osu! server that display scores<br>
            that are not ranked on official servers such as <strong>Relax</strong> and <strong>AutoPilot</strong>.<br>
            We have <strong>Dan Certifications</strong> in all game modes that allows you to measure your skill level.<br>
            Also, we have a <a class="an-tab" href="/discord" target="_blank" rel="noopener noreferrer">Discord</a> server so please join us as we provide you with a variety of information!
            `,
            {
                not_logged_in: "We're a pleasure to see you! How can I help you?",
                logged_in: [
                    "Welcome back, ",
                    ". Have fun!"
                ]
            },
            {
                register: "Register",
                signin: "Sign in",
                connection: "Connection guide",
                leaderboard: "Leaderboard",
                profile: "Profile"
            }
        ]
    },
    jp: {

    }
};
module.exports = contents;
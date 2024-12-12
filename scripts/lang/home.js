const contents = {
    en: {
        title: "Dashboard",
        pageName: "Home Page",
        text: {
            description:
                `
                Welcome to <span>Mamestagram</span>! This is a private osu! server that display scores<br>
                that are not ranked on official servers such as <strong>Relax</strong> and <strong>AutoPilot</strong>.<br>
                We have <strong>Dan Certifications</strong> in all game modes that allows you to measure your skill level.<br>
                Also, we have a <a class="an-tab" href="/discord" target="_blank" rel="noopener noreferrer">Discord</a> server so please join us as we provide you with a variety of information!
                `,
            greetings: {
                not_logged_in: "We're a pleasure to see you! How can I help you?",
                logged_in: [
                    "Welcome back, ",
                    ". Have fun!"
                ]
            },
            menu: {
                register: "Register",
                signin: "Sign in",
                connection: "Connection guide",
                leaderboard: "Leaderboard",
                profile: "Profile"
            },
            h2: [
                "Server Status",
                "PP Records"
            ],
            t1: {
                tScore: "Total Score",
                acc: "Accuracy",
                MaxCmb: "Max Combo"
            },
            t2: {
                miss: "Miss",
                time: "Time",
                mods: "Mods"
            }
        }
    },
    ja: {
        title: "ダッシュボード",
        pageName: "ホーム",
        text: {
            description:
                `
                <span>Mamestagram</span>へようこそ! このプライベートサーバーでは、<strong>Relax</strong>や<strong>AutoPilot</strong>のような<br>
                公式サーバーではスコア表示されないモードも利用することができます。<br>
                また、すべてのモードに<strong>段位道場</strong>が実装されているので自分の腕前を試すのも如何でしょうか。<br>
                さらに、Mamestagramの<a class="an-tab" href="/discord" target="_blank" rel="noopener noreferrer">Discord</a>サーバーもあります。ここでは様々な情報を提供しているので是非ご参加ください!
                `,
            greetings: {
                not_logged_in: "初めまして!何かお手伝いできることはありますか?",
                logged_in: [
                    "お帰りなさい、",
                    "さん。どうぞ楽しんで!"
                ]
            },
            menu: {
                register: "アカウント作成",
                signin: "ログイン",
                connection: "接続方法",
                leaderboard: "ランキング",
                profile: "プロフィール"
            },
            h2: [
                "プレイヤー人数",
                "トッププレイヤー"
            ],
            t1: {
                tScore: "合計スコア",
                acc: "精度",
                MaxCmb: "最大コンボ"
            },
            t2: {
                miss: "ミス数",
                time: "時間",
                mods: "モッド"
            }
        }
    }
};
module.exports = contents;
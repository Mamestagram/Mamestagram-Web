/* モード名取得
1 → "std"
2 → "taiko"
3 → "ctb"
4 → "mania"
*/
const modeName = (modeNum) => {
    let name = "";
    if (modeNum / 4 > 1) {
        name = "rx";
    }
    else if (modeNum / 4 > 2) {
        name = "ap";
    }
    switch (modeNum % 4) {
        case 0: name += "std"; break;
        case 1: name += "taiko"; break;
        case 2: name += "ctb"; break;
        case 3: name += "mania"; break;
        default: name = "std"; break;
    }
    return name;
}
const elapsedTime = (time) => {
    
}

// 経過時間取得（timeは{year, month, week, day, hour, minute, second}の5つのプロパティがあるもの）
const elapsedTime = (time) => {
    if (time.year > 0) {
        return `${time.year}y`;
    }
    else if (time.month > 0) {
        return `${time.month}m`;
    }
    else if (time.week > 0) {
        return `${time.week}w`;
    }
    else if (time.day > 0) {
        return `${time.day}d`;
    }
    else if (time.hour > 0) {
        return `${time.hour}h`;
    }
    else if (time.minute > 0) {
        return `${time.minute}m`;
    }
    else {
        return `${time.second}s`;
    }
}

// タイムゾーン別の時間取得（引数timeはDate型）
const locationTime = (time, timezone, lang) => {
    const locationTime = time.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timezone,
        timeZoneName: "short",
        language: lang
    });
    return locationTime;
}

// モッド（配列）取得
const mods = (modNum) => {
    /* モッド並び替え
    1. rx
    2. ap
    3. k4
    4. k5
    5. k6
    6. k7
    7. k8
    8. k9
    9. nf
    10. ez
    11. ht
    12. sd
    13. pf
    14. fi
    15. hd
    16. hr
    17. dt
    18. nc
    19. fl
    20. rd
    21. mr
    22. so
    23. v2
    */
    const sortMods = (mods) => {
        const order = ["rx", "ap", "k4", "k5", "k6", "k7", "k8", "k9", "nf", "ez", "ht", "sd", "pf", "fi", "hd", "hr", "dt", "nc", "fl", "rd", "mr", "so", "v2"];
        let sort = new Array(0);
        order.forEach((item) => {
            if (mods.includes(item) && ((item !== "sd" && item !== "dt") || (item === "sd" && !mods.includes("pf")) || (item === "dt" && !mods.includes("nc")))) {
                sort.push(item);
            }
        });
        return sort;
    }

    let mod = new Array(0);
    const mods = [
        "nf", // 0 : NoFail
        "ez", // 1 : Eazy
        "ts", // 2 : TouchScreen
        "hd", // 3 : Hidden
        "hr", // 4 : HardRock
        "sd", // 5 : SaddenDeath
        "dt", // 6 : DoubleTime
        "rx", // 7 : Relax
        "ht", // 8 : HalfTime
        "nc", // 9 : NightCore
        "fl", // 10 : FlashLight
        "at", // 11 : AutoPlay
        "so", // 12 : SpinOut
        "ap", // 13 : Autopilot
        "pf", // 14 : Perfect
        "k4", // 15 : Key4
        "k5", // 16 : Key5
        "k6", // 17 : Key6
        "k7", // 18 : Key7
        "k8", // 19 : Key8
        "fi", // 20 : FadeIn
        "rd", // 21 : Random
        "cm", // 22 : Cinema
        "tp", // 23 : TargetPoint
        "k9", // 24 : Key9
        "kc", // 25 : KeyCoop
        "k1", // 26 : Key1
        "k3", // 27 : Key3
        "k2", // 28 : Key2
        "v2", // 29 : ScoreV2
        "mr"  // 30 : Mirror
    ];
    for (let i = 0; i <= 30; i++) {
        if (modNum & 1 << i) {
            mod.push(mods[i]);
        }
    }
    mod = sortMods(mod);
    return mod;
}

// モッド名取得（modは2文字のモッド名）
const modName = (mod) => {
    switch (mod) {
        case "nm": return "No Mod";
        case "nf": return "No Fail";
        case "ez": return "Easy";
        case "ht": return "Half Time";
        case "hr": return "Hard Rock";
        case "sd": return "Sudden Death";
        case "pf": return "Perfect";
        case "dt": return "Double Time";
        case "nc": return "Nightcore";
        case "fi": return "Fade In";
        case "hd": return "Hidden";
        case "fl": return "Flashlight";
        case "rx": return "Relax";
        case "ap": return "Auto Pilot";
        case "so": return "Spun Out";
        case "k4": return "4 Keys";
        case "k5": return "5 Keys";
        case "k6": return "6 Keys";
        case "k7": return "7 Keys";
        case "k8": return "8 Keys";
        case "k9": return "9 Keys";
        case "mr": return "Mirror";
        case "v2": return "Score V2";
    }
}

// htmlで使用するモッド名取得（modは2文字のモッド名）
const modClassName = (mod) => {
    switch (mod) {
        case "nm": return "fa-solid fa-ban";
        case "nf": return "fa-duotone fa-solid fa-life-ring";
        case "ez": return "fa-duotone fa-solid fa-candy";
        case "ht": return "fa-duotone fa-solid fa-hourglass-clock";
        case "hr": return "fa-duotone fa-solid fa-hand-love";
        case "sd": return "fa-duotone fa-solid fa-skull";
        case "pf": return "fa-duotone fa-solid fa-thumbs-up";
        case "nc": return "fa-duotone fa-solid fa-headphones-simple";
        case "fi": return "fa-solid fa-keyboard-brightness";
        case "hd": return "fa-duotone fa-solid fa-eye-slash";
        case "fl": return "fa-duotone fa-solid fa-flashlight";
        case "rx": return "fa-duotone fa-solid fa-martini-glass-citrus";
        case "ap": return "fa-duotone fa-solid fa-plane";
        case "so": return "fa-duotone fa-solid fa-fan";
        case "k4":
        case "k5": 
        case "k6": 
        case "k7": 
        case "k8": 
        case "k9": return "fa-light fa-piano-keyboard"; 
        case "mr": return "fa-duotone fa-solid fa-rotate-reverse";
        case "v2": return "fa-duotone fa-solid fa-square-2";
    }
}

module.exports = {
    modeName,
    elapsedTime,
    locationTime,
    mods,
    modName,
    modClassName
}
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
const sortMods = (mods) => {
    const order = ["rx", "ap", "k4", "k5", "k6", "k7", "nf", "ez", "ht", "hd", "hr", "dt", "nc", "sd", "pf", "fl", "fi", "rd", "mr", "so", "v2"];
    let rst = new Array(0);
    order.forEach((item) => {
        if (mods.includes(item)) {
            rst.push(item);
        }
    });
    return rst;
}
const mods = (modNum) => {
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
    for (let i = 30; i >= 0; i--) {
        if (i !== 2 && i !== 11 && i !== 19 && i !== 22 && !(i >= 24 && i <= 28) && modNum >= 1 << i) {
            switch (i) {
                case 14:
                    modNum -= 1 << 5;
                    break;
                case 9:
                    modNum -= 1 << 6;
                    break;
            }
            mod.push(mods[i]);
            modNum -= 1 << i;
        }
    }
    mod = sortMods(mod);
    return mod;
}

module.exports = {
    modeName,
    elapsedTime,
    locationTime,
    mods
}
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

module.exports = {
    modeName
}
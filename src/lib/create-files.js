const fs = require("fs").promises;
const { CSGO_ROUND_LENGTH } = require("./utils/constants.js");
const { camelizeIsh } = require("./utils/utils.js");

async function createFiles(data) {
    const dir = __dirname + "../../../exports";
    await fs.writeFile(dir + "/highlights.txt", "\n");
    for (const match of data) {
        const matchText = [`**playdemo ${match.demoName}`];
        const matchPrintFormat = [];

        match.roundsWithHighlights.forEach(({ roundNumber, highlights }) => {
            const roundNumberStr =
                roundNumber.toString().length == 1 ? "0" + roundNumber : roundNumber;

            highlights.forEach(
                ({
                    player,
                    fragType,
                    fragCategory,
                    allKillsThatRoundForPlayer: individualKills,
                    clutchOpponents,
                    team,
                    antieco,
                    steamId,
                }) => {
                    const playerCamelized = camelizeIsh(player);
                    const teamCamelized = camelizeIsh(team);
                    const weaponsUsed = getWeaponsUsed(individualKills);
                    const killAmount = individualKills.length;

                    // TODO: Extract to own function
                    //e.g. 1v3-4k vs just 4k
                    const fragTypeDetails =
                        fragType === "clutch"
                            ? clutchOpponents === killAmount
                                ? `1v${clutchOpponents}`
                                : `1v${clutchOpponents}-${
                                      killAmount == 5 ? "ACE" : killAmount + "k"
                                  }`
                            : fragType === "5k"
                            ? "ACE"
                            : fragType.includes("deagle")
                            ? fragType.match(/[0-9]+/g)[0] == killAmount
                                ? fragType
                                : `${fragType}-${killAmount}k`
                            : fragType;

                    const firstKillTimestamp = CSGO_ROUND_LENGTH - individualKills[0].time + 1;

                    const lastKillTimestamp =
                        CSGO_ROUND_LENGTH - individualKills[killAmount - 1].time + 1;

                    // e.g. 0:54, 1:32 etc.
                    const firstKillTimeStr =
                        firstKillTimestamp - 60 > 0
                            ? `1:${Math.trunc(firstKillTimestamp - 60)
                                  .toString()
                                  .padStart(2, "0")}`
                            : Math.trunc(firstKillTimestamp).toString().padStart(4, "0:");

                    const tickFirstKill = individualKills[0].tick - 200;

                    const fragSpeed =
                        firstKillTimestamp - lastKillTimestamp < 6
                            ? "-fast"
                            : individualKills.filter((kill, i) => {
                                  if (i + 1 != killAmount) {
                                      return individualKills[i + 1].time - kill.time > 15;
                                  }
                              }).length >= 2
                            ? "-spread"
                            : "";

                    matchPrintFormat.push({
                        fragType,
                        fragCategory,
                        steamId,
                        tickFirstKill,
                        fragPrintFormat: `x._${playerCamelized}_${fragTypeDetails}${
                            !fragType.includes("deagle") ? "-" + weaponsUsed + fragSpeed : ""
                        }_${match.map}_team-${teamCamelized}_r${roundNumberStr}${
                            antieco ? "_#ANTIECO" : ""
                        } ${firstKillTimeStr} (demo_gototick ${tickFirstKill})`,
                    });
                }
            );
        });

        matchPrintFormat.sort((a, b) => {
            return a.fragCategory - b.fragCategory;
        });

        matchPrintFormat.forEach(({ fragType, fragPrintFormat }) => {
            if (fragType === "3k") {
                const text3ks = `\n${addSpaces(9)}----3k's:\n`;
                if (!matchText.includes(text3ks)) {
                    matchText.push(text3ks);
                }

                matchText.push(`${addSpaces(15)}${fragPrintFormat}\n`);
            } else if (!fragType.includes("deagle")) {
                matchText.push(`${addSpaces(3)}${fragPrintFormat}\n`);
            }
        });

        if (!match.roundsWithHighlights.length) {
            matchText.splice(
                1,
                0,
                match.breakMsg
                    ? `\n\n${addSpaces(4)}${match.breakMsg}\n`
                    : `${addSpaces(3)}no frags found. \n`
            );
        }

        if (matchPrintFormat[0]) matchText[0] += `@${matchPrintFormat[0].tickFirstKill}\n\n`;

        await fs.appendFile(dir + "/highlights.txt", matchText.join("") + "\n\n\n");
    }
}

function getWeaponsUsed(kills) {
    const killsPerWeapon = kills
        .map((kill) => [kill.weaponName, kill.weaponType])
        .reduce((acc, curr) => {
            switch (curr[0]) {
                case "AK-47":
                case "M4A4":
                case "M4A1-S":
                case "CZ75-Auto": {
                    const shortVersion = curr[0].substr(0, 2);
                    setWeaponName(shortVersion, acc);
                    return acc;
                }

                case "Desert Eagle":
                    setWeaponName("deagle", acc);
                    return acc;

                case "Galil AR":
                    setWeaponName("Galil", acc);
                    return acc;

                case "Scar-20":
                    setWeaponName("Autosniper", acc);
                    return acc;

                case "Incendiary":
                    setWeaponName("molotov", acc);
                    return acc;

                case "SSG 08":
                    setWeaponName("scout", acc);
                    return acc;

                case "SG 553":
                    setWeaponName("krieg", acc);
                    return acc;

                case "UMP-45":
                    setWeaponName("UMP", acc);
                    return acc;

                case "MP5-SD":
                    setWeaponName("mp5", acc);
                    return acc;

                default:
                    if (curr[1] === 1) {
                        setWeaponName("pistol", acc);
                        return acc;
                    } else if (curr[0] === "HE Grenade") {
                        setWeaponName("HE", acc);
                        return acc;
                    } else if (curr[1] === 5) {
                        setWeaponName("shotgun", acc);
                        return acc;
                    } else {
                        setWeaponName(curr[0], acc);
                        return acc;
                    }
            }
        }, {});

    const keys = Object.keys(killsPerWeapon);

    return keys.length === 1
        ? keys[0]
        : keys
              .map((weapon, i) => `${i === 0 ? "" : "-"}${weapon}(${killsPerWeapon[weapon]})`)
              .join("");
}

function setWeaponName(name, obj) {
    obj[name] = obj[name] + 1 || 1;
}

function addSpaces(amount) {
    return " ".repeat(amount);
}

module.exports = {
    createFiles,
    getWeaponsUsed,
    setWeaponName,
    addSpaces,
};

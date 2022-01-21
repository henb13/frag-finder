const fs = require("fs").promises;
const { CSGO_ROUND_LENGTH } = require("../lib/utils/constants.js");
const { camelizeIsh } = require("../lib/utils/utils.js");

module.exports = async function createFiles(data) {
    await fs.writeFile("./exports/highlights.txt", "\n");
    for (const match of data) {
        const matchText = [`**playdemo ${match.demoName}`];
        const matchFragFormat = [];

        match.roundsWithHighlights.forEach(({ roundNumber, frags }) => {
            const roundNumberStr =
                roundNumber.toString().length == 1 ? "0" + roundNumber : roundNumber;

            frags.forEach(
                ({
                    killAmount,
                    fragType,
                    fragCategory,
                    clutchOpponents,
                    individualKills,
                    team,
                    antieco,
                    player,
                    tick,
                    steamId,
                }) => {
                    const playerCamelized = camelizeIsh(player);

                    //i.e. 1v3-4k vs just 4k
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

                    const firstKillTimestamp =
                        CSGO_ROUND_LENGTH - individualKills[0].timestamp + 1;

                    const lastKillTimestamp =
                        CSGO_ROUND_LENGTH - individualKills[killAmount - 1].timestamp + 1;

                    const firstKillTimeStr =
                        firstKillTimestamp - 60 > 0
                            ? `1:${Math.trunc(firstKillTimestamp - 60)
                                  .toString()
                                  .padStart(2, "0")}`
                            : Math.trunc(firstKillTimestamp).toString().padStart(4, "0:");

                    const fragSpeed =
                        firstKillTimestamp - lastKillTimestamp < 6
                            ? "-fast"
                            : individualKills.filter((kill, i) => {
                                  if (i + 1 != killAmount) {
                                      return (
                                          individualKills[i + 1].timestamp - kill.timestamp >
                                          15
                                      );
                                  }
                              }).length >= 2
                            ? "-spread"
                            : "";

                    const weaponsUsed = getWeaponsUsed(individualKills);

                    const teamCamelized = camelizeIsh(team);

                    matchFragFormat.push({
                        fragType,
                        fragCategory,
                        steamId,
                        tick,
                        fragFormat: `x._${playerCamelized}_${fragTypeDetails}${
                            !fragType.includes("deagle") ? "-" + weaponsUsed + fragSpeed : ""
                        }_${match.map}_team-${teamCamelized}_r${roundNumberStr}${
                            antieco ? "_#ANTIECO" : ""
                        } ${firstKillTimeStr} (demo_gototick ${tick})`,
                    });
                }
            );
        });

        matchFragFormat.sort((a, b) => {
            return a.fragCategory - b.fragCategory;
        });

        matchFragFormat.forEach(({ fragType, fragFormat }, i) => {
            if (fragType === "3k") {
                //Regular indented
                const text3ks = `\n${insertSpaces(9)}----3k's:\n`;
                if (!matchText.includes(text3ks)) {
                    matchText.push(text3ks);
                }

                //Extra indented for 3k's
                matchText.push(`${insertSpaces(15)}${fragFormat}\n`);
            } else {
                if (!fragType.includes("deagle")) {
                    matchText.push(`${insertSpaces(3)}${fragFormat}\n`);
                }
            }
        });

        if (!match.roundsWithHighlights.length) {
            matchText.splice(
                1,
                0,
                match.breakMsg
                    ? `\n\n${insertSpaces(4)}${match.breakMsg}\n`
                    : `${insertSpaces(3)}no frags found. \n`
            );
        }

        if (matchFragFormat[0]) {
            // TODO: kun @tick på playdemo om valgt i options
            matchText[0] += `@${matchFragFormat.find(f => f.fragCategory === 1).tick}\n\n`;
            // matchText[0] += `\n\n`;
        }

        await fs.appendFile("./exports/highlights.txt", matchText.join("") + "\n\n\n");
    }
};

function getWeaponsUsed(kills) {
    let weaponsUsed = kills
        .map(kill => [kill.weapon, kill.weaponType])
        .reduce((acc, curr) => {
            switch (curr[0]) {
                case "AK-47":
                case "M4A4":
                case "M4A1-S":
                case "CZ75-Auto": {
                    const shortVersion = curr[0].substr(0, 2);
                    acc[shortVersion] = acc[shortVersion] + 1 || 1;
                    return acc;
                }

                case "Desert Eagle":
                    acc["deagle"] = acc["deagle"] + 1 || 1;
                    return acc;

                case "Galil AR":
                    acc["Galil"] = acc["Galil"] + 1 || 1;
                    return acc;

                case "Scar-20":
                    acc["Autosniper"] = acc["Autosniper"] + 1 || 1;
                    return acc;

                case "Incendiary":
                    acc["molotov"] = acc["molotov"] + 1 || 1;
                    return acc;

                case "SSG 08":
                    acc["scout"] = acc["scout"] + 1 || 1;
                    return acc;

                case "SG 553":
                    acc["krieg"] = acc["krieg"] + 1 || 1;
                    return acc;

                case "UMP-45":
                    acc["UMP"] = acc["UMP"] + 1 || 1;
                    return acc;

                case "MP5-SD":
                    acc["mp5"] = acc["mp5"] + 1 || 1;
                    return acc;

                default:
                    if (curr[1] === 1) {
                        acc["pistol"] = acc["pistol"] + 1 || 1;
                        return acc;
                    } else if (curr[0] === "HE Grenade") {
                        acc["HE"] = acc["HE"] + 1 || 1;
                        return acc;
                    } else if (curr[1] === 5) {
                        acc["shotgun"] = acc["shotgun"] + 1 || 1;
                        return acc;
                    } else {
                        acc[curr[0]] = acc[curr[0]] + 1 || 1;
                        return acc;
                    }
            }
        }, {});

    const keys = Object.keys(weaponsUsed);

    weaponsUsed =
        keys.length === 1
            ? keys[0]
            : keys
                  .map((weapon, i) => `${i === 0 ? "" : "-"}${weapon}(${weaponsUsed[weapon]})`)
                  .join("");

    return weaponsUsed;
}

function insertSpaces(amount) {
    return " ".repeat(amount);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs").promises;
const { CSGO_ROUND_LENGTH } = require("./utils/constants");
const { camelizeIsh } = require("./utils/utils");
async function createFiles(data, options = {}) {
    const dir = path.resolve(__dirname, process.env.TEXTFILE === "1" ? "../__tests__" : options.outDir || "../../exports");
    const printFileName = process.env.TEXTFILE === "1" ? "correct_app_output.txt" : "highlights.txt";
    await fs.writeFile(`${dir}/${printFileName}`, "\n");
    for (const match of data) {
        const matchText = [`**playdemo ${match.demoName}`];
        const matchPrintFormat = [];
        match.rounds.forEach(({ roundNumber, highlights }) => {
            const roundNumberStr = roundNumber.toString().length == 1 ? "0" + roundNumber : roundNumber;
            highlights.forEach((h) => {
                const playerCamelized = camelizeIsh(h.playerName);
                const teamCamelized = camelizeIsh(h.team);
                const weaponsUsed = getWeaponsUsed(h.allKillsThatRoundForPlayer);
                const killAmount = h.allKillsThatRoundForPlayer.length;
                const fragTypeDetails = getFragTypeDetails(h.fragType, killAmount, h.clutchOpponents);
                const clockTimeFirstKill = getIngameClockTime(CSGO_ROUND_LENGTH - h.allKillsThatRoundForPlayer[0].time + 1);
                const tickFirstKill = h.allKillsThatRoundForPlayer[0].tick - 200;
                const fragSpeed = getFragSpeed(h.allKillsThatRoundForPlayer);
                const fragSpeedStr = fragSpeed ? `-${fragSpeed}` : "";
                matchPrintFormat.push({
                    fragType: h.fragType,
                    fragCategory: h.fragCategory,
                    tickFirstKill,
                    fragPrintFormat: `x._${playerCamelized}_${fragTypeDetails}${!h.fragType.includes("deagle") ? "-" + weaponsUsed + fragSpeedStr : ""}_${match.map}_team-${teamCamelized}_r${roundNumberStr}${h.isAntieco ? "_#ANTIECO" : ""} ${clockTimeFirstKill} (demo_gototick ${tickFirstKill})`,
                });
            });
        });
        matchPrintFormat.sort((a, b) => {
            return a.fragCategory - b.fragCategory;
        });
        matchPrintFormat.forEach(({ fragType, fragPrintFormat }) => {
            if (fragType === "3k") {
                const headlineText3ks = `\n${addSpaces(9)}----3k's:\n`;
                if (!matchText.includes(headlineText3ks)) {
                    matchText.push(headlineText3ks);
                }
                matchText.push(`${addSpaces(15)}${fragPrintFormat}\n`);
            }
            else if (!fragType.includes("deagle")) {
                matchText.push(`${addSpaces(3)}${fragPrintFormat}\n`);
            }
        });
        if (!match.rounds.length) {
            matchText.splice(1, 0, match.errorMessage
                ? `\n\n${addSpaces(4)}${match.errorMessage}\n`
                : `${addSpaces(3)}no frags found. \n`);
        }
        if (matchPrintFormat[0])
            matchText[0] += `@${matchPrintFormat[0].tickFirstKill}\n\n`;
        await fs.appendFile(`${dir}/${printFileName}`, matchText.join("") + "\n\n\n");
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
                incrementWeaponKillCount(shortVersion, acc);
                return acc;
            }
            case "Desert Eagle":
                incrementWeaponKillCount("deagle", acc);
                return acc;
            case "Galil AR":
                incrementWeaponKillCount("Galil", acc);
                return acc;
            case "Scar-20":
                incrementWeaponKillCount("Autosniper", acc);
                return acc;
            case "Incendiary":
                incrementWeaponKillCount("molotov", acc);
                return acc;
            case "SSG 08":
                incrementWeaponKillCount("scout", acc);
                return acc;
            case "SG 553":
                incrementWeaponKillCount("krieg", acc);
                return acc;
            case "UMP-45":
                incrementWeaponKillCount("UMP", acc);
                return acc;
            case "MP5-SD":
                incrementWeaponKillCount("mp5", acc);
                return acc;
            default:
                if (curr[1] === 1) {
                    incrementWeaponKillCount("pistol", acc);
                    return acc;
                }
                else if (curr[0] === "HE Grenade") {
                    incrementWeaponKillCount("HE", acc);
                    return acc;
                }
                else if (curr[1] === 5) {
                    incrementWeaponKillCount("shotgun", acc);
                    return acc;
                }
                else {
                    incrementWeaponKillCount(curr[0], acc);
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
function incrementWeaponKillCount(name, obj) {
    obj[name] = obj[name] + 1 || 1;
}
function getFragTypeDetails(fragType, killAmount, clutchOpponents) {
    if (fragType === "clutch") {
        return clutchOpponents === killAmount
            ? `1v${clutchOpponents}`
            : `1v${clutchOpponents}-${killAmount == 5 ? "ACE" : killAmount + "k"}`;
    }
    if (fragType === "5k") {
        return "ACE";
    }
    if (fragType.includes("deagle") && Number(fragType.match(/[0-9]+/g)?.[0]) !== killAmount) {
        return `${fragType}-${killAmount}k`;
    }
    return fragType;
}
function getFragSpeed(allKillsThatRoundForPlayer) {
    const FAST_KILL_SEC_THRESHOLD = 6;
    const SPREAD_KILL_SEC_THRESHOLD = 15;
    const killAmount = allKillsThatRoundForPlayer.length;
    const lastKillTimestamp = CSGO_ROUND_LENGTH - allKillsThatRoundForPlayer[killAmount - 1].time + 1;
    const firstKillTimestamp = CSGO_ROUND_LENGTH - allKillsThatRoundForPlayer[0].time + 1;
    if (firstKillTimestamp - lastKillTimestamp < FAST_KILL_SEC_THRESHOLD) {
        return "fast";
    }
    const killsWithNotableTimeBetween = allKillsThatRoundForPlayer.filter((kill, i) => {
        return (allKillsThatRoundForPlayer[i + 1]?.time - kill.time > SPREAD_KILL_SEC_THRESHOLD ||
            false);
    });
    if (killsWithNotableTimeBetween.length >= 2) {
        return "spread";
    }
    return null;
}
function getIngameClockTime(firstKillTimestamp) {
    return firstKillTimestamp - 60 > 0
        ? `1:${Math.trunc(firstKillTimestamp - 60)
            .toString()
            .padStart(2, "0")}`
        : Math.trunc(firstKillTimestamp).toString().padStart(4, "0:");
}
function addSpaces(amount) {
    return " ".repeat(amount);
}
module.exports = {
    createFiles,
    getWeaponsUsed,
    setWeaponName: incrementWeaponKillCount,
    getFragTypeDetails,
    getFragSpeed,
    getIngameClockTime,
    addSpaces,
};

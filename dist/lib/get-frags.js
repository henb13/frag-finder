"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.isHighlightAntieco = exports.hasDeagleHs = exports.getFragtype = exports.demoIsBroken = exports.getFrags = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
async function getFrags(options = {}) {
    const dir = path_1.default.resolve(__dirname, options.jsonDir || "../../json");
    const files = await fs_1.promises.readdir(dir);
    const jsonFiles = files.filter((file) => path_1.default.extname(file).toLowerCase() === ".json");
    const matchesAnalyzed = [];
    for (let i = 0; i < jsonFiles.length; i++) {
        const data = await fs_1.promises.readFile(`${dir}/${jsonFiles[i]}`, { encoding: "utf8" });
        const matchData = JSON.parse(data);
        console.log("analyzing match: ", matchData.name);
        matchesAnalyzed.push({
            demoName: matchData.name.replace(".dem", ""),
            map: matchData.map_name.replace("de_", ""),
            rounds: [],
        });
        if (demoIsBroken(matchData)) {
            matchesAnalyzed[i].errorMessage = getErrorMessage(matchData);
            continue;
        }
        const allNotableClutchesInMatch = matchData.players.flatMap((player) => {
            return player.clutches
                .filter((clutch) => clutch.has_won && clutch.opponent_count >= 3)
                .map((clutch) => {
                return {
                    playerSteamid: player.steamid,
                    opponentCount: clutch.opponent_count,
                    roundNumber: clutch.round_number,
                };
            });
        });
        matchData.rounds.forEach((currentRound, roundIndex) => {
            matchesAnalyzed[i].rounds.push({
                roundNumber: currentRound.number,
                highlights: [],
            });
            let roundkillsPerPlayer = currentRound.kills.reduce((acc, kill) => {
                if (kill.killer_team === kill.killed_team) {
                    return acc;
                }
                const killMapped = {
                    tick: kill.tick,
                    time: kill.time_death_seconds,
                    weaponType: kill.weapon.type,
                    weaponName: kill.weapon.weapon_name,
                    isHeadshot: kill.is_headshot,
                    killedPlayerSteamId: kill.killed_steamid,
                };
                const player = acc.find((player) => player.steamid === kill.killer_steamid);
                if (player) {
                    player.allKillsThatRoundForPlayer.push(killMapped);
                }
                else {
                    acc.push({
                        steamid: kill.killer_steamid,
                        playerName: kill.killer_name,
                        team: kill.killer_team,
                        allKillsThatRoundForPlayer: [killMapped],
                    });
                }
                return acc;
            }, []);
            if (options.playerSteamId) {
                roundkillsPerPlayer = roundkillsPerPlayer.filter((player) => player.steamid === options.playerSteamId);
            }
            for (const player of roundkillsPerPlayer) {
                const { allKillsThatRoundForPlayer, steamid, team: playerTeam, playerName, } = player;
                const clutch = allNotableClutchesInMatch.find((clutch) => clutch.roundNumber === currentRound.number &&
                    clutch.playerSteamid === steamid);
                const fragType = clutch ? "clutch" : getFragtype(allKillsThatRoundForPlayer);
                if (allKillsThatRoundForPlayer.length >= 3 || fragType.includes("deagle")) {
                    const fragCategory = clutch || allKillsThatRoundForPlayer.length > 3
                        ? 1
                        : fragType.includes("deagle")
                            ? 2
                            : 3;
                    const team = playerTeam
                        ? playerTeam.includes("]")
                            ? playerTeam.split("]")[1].trim()
                            : playerTeam.trim()
                        : "not found";
                    const isAntieco = isHighlightAntieco(allKillsThatRoundForPlayer, matchData.players, currentRound.number);
                    matchesAnalyzed[i].rounds[roundIndex].highlights.push({
                        playerName,
                        team,
                        fragType,
                        fragCategory,
                        ...(clutch ? { clutchOpponents: clutch.opponentCount } : {}),
                        isAntieco,
                        allKillsThatRoundForPlayer,
                    });
                }
            }
        });
    }
    return matchesAnalyzed;
}
exports.getFrags = getFrags;
function demoIsBroken(matchData) {
    return matchData.rounds.length <= 15;
}
exports.demoIsBroken = demoIsBroken;
function getFragtype(kills) {
    if (kills.length >= 3) {
        return `${kills.length}k`;
    }
    if (hasDeagleHs(kills)) {
        const deagleKills = kills.filter((kill) => kill.weaponName === "Desert Eagle");
        return `deagle${deagleKills.length}k`;
    }
    return `${kills.length}k`;
}
exports.getFragtype = getFragtype;
function hasDeagleHs(kills) {
    return kills.some((kill) => kill.weaponName === "Desert Eagle" && kill.isHeadshot);
}
exports.hasDeagleHs = hasDeagleHs;
function isHighlightAntieco(kills, players, roundNumber) {
    const THRESHOLD = 1000;
    const killedSteamIds = kills.map((kill) => kill.killedPlayerSteamId);
    const enemyPlayers = players.filter((player) => killedSteamIds.includes(player.steamid));
    return (enemyPlayers.every((player) => player.equipement_value_rounds[roundNumber] < THRESHOLD) && ![1, 16].includes(roundNumber));
}
exports.isHighlightAntieco = isHighlightAntieco;
function getErrorMessage(matchData) {
    const len = matchData.rounds.length;
    const errorMessage = `Unable to extract highlights from this match. There ${len === 1 ? "is" : "are"} ${len === 0 ? "no" : "only"}${len ? ` ${len}` : ""} round${len === 1 ? "" : "s"} in the JSON file. The demo is probably partially corrupted, but looking through it manually in-game might work.`;
    return errorMessage;
}
exports.getErrorMessage = getErrorMessage;

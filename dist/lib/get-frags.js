const fs = require("fs").promises;
const path = require("path");
async function getFrags(playerChosen = null) {
    const dir = __dirname + "../../../json";
    const demosHighlights = [];
    const files = await fs.readdir(dir);
    const demoFiles = files.filter((file) => path.extname(file).toLowerCase() === ".json");
    for (let i = 0; i < demoFiles.length; i++) {
        const data = await fs.readFile(`${dir}/${demoFiles[i]}`);
        const matchData = await JSON.parse(data);
        console.log("analyzing demo: ", matchData.name);
        demosHighlights.push({
            demoName: matchData.name.replace(".dem", ""),
            map: matchData.map_name.replace("de_", ""),
            roundsWithHighlights: [],
        });
        if (demoIsBroken(matchData)) {
            const len = matchData.rounds.length;
            const breakMsg = `Unable to extract highlights from this demo. There ${len === 1 ? "is" : "are"} ${len === 0 ? "no" : "only"}${len ? " " + len : ""} round${len === 1 ? "" : "s"} in the JSON file. The demo is probably partially corrupted, but looking through it manually in-game might work. You could also try to analyze it again in CS:GO Demos Manager, export a new JSON file, and try again.`;
            demosHighlights[i].breakMsg = breakMsg;
            continue;
        }
        const allNotableClutchesInMatch = matchData.players
            .map((player) => {
            return player.clutches
                .filter((clutch) => clutch.has_won && clutch.opponent_count >= 3)
                ?.map((clutch) => {
                return {
                    player: player.name,
                    opponentCount: clutch.opponent_count,
                    roundNumber: clutch.round_number,
                };
            });
        })
            .filter((player) => player.length)
            .flat();
        console.log("allNotableClutchesInMatch: ", JSON.stringify(allNotableClutchesInMatch, null, 4));
        matchData.rounds.forEach((currentRound, roundIndex) => {
            demosHighlights[i].roundsWithHighlights.push({
                roundNumber: currentRound.number,
                frags: [],
            });
            let roundkillsPerPlayer = currentRound.kills
                .map((kill) => {
                return {
                    killerName: kill.killer_name,
                    tick: kill.tick,
                    killerTeam: kill.killer_team,
                    timeOfKill: kill.time_death_seconds,
                    weapon: {
                        type: kill.weapon.type,
                        name: kill.weapon.weapon_name,
                    },
                    isHeadshot: kill.is_headshot,
                    killedPlayerSteamId: kill.killed_steamid,
                };
            })
                .reduce((acc, kill) => {
                if (acc[kill.killerName]) {
                    acc[kill.killerName].allKillsThatRoundForPlayer.push(kill);
                }
                else {
                    acc[kill.killerName] = {
                        steamId: kill.killedPlayerSteamId,
                        allKillsThatRoundForPlayer: [kill],
                    };
                }
                return acc;
            }, {});
            console.log("roundkillsPerPlayer:", JSON.stringify(roundkillsPerPlayer, null, 4));
            if (playerChosen) {
                roundkillsPerPlayer = Object.fromEntries(Object.entries(roundkillsPerPlayer).filter(([_, val]) => val.steamId === playerChosen));
            }
            for (const player in roundkillsPerPlayer) {
                const { allKillsThatRoundForPlayer, steamId } = roundkillsPerPlayer[player];
                const tickFirstKill = allKillsThatRoundForPlayer[0].tick - 200;
                const clutch = allNotableClutchesInMatch.find(({ roundNumber, player }) => roundNumber === currentRound.number && player === player);
                const fragType = getFragtype(allKillsThatRoundForPlayer, clutch);
                if (allKillsThatRoundForPlayer.length >= 3 || fragType.includes("deagle")) {
                    const fragCategory = clutch || allKillsThatRoundForPlayer.length > 3
                        ? 1
                        : fragType.includes("deagle")
                            ? 2
                            : 3;
                    const team = allKillsThatRoundForPlayer[0].killerTeam
                        ? allKillsThatRoundForPlayer[0].killerTeam.includes("]")
                            ? allKillsThatRoundForPlayer[0].killerTeam.split("]")[1].trim()
                            : allKillsThatRoundForPlayer[0].killerTeam.trim()
                        : "not found";
                    demosHighlights[i].roundsWithHighlights[roundIndex].frags.push({
                        player,
                        steamId,
                        team,
                        fragType,
                        fragCategory,
                        ...(clutch ? { clutchOpponents: clutch.opponentCount } : {}),
                        antieco: isAntieco(allKillsThatRoundForPlayer, matchData, currentRound),
                        killAmount: allKillsThatRoundForPlayer.length,
                        tick: tickFirstKill,
                        individualKills: allKillsThatRoundForPlayer.map((kill) => ({
                            timestamp: kill.timeOfKill,
                            weapon: kill.weapon.weaponName,
                            weaponType: kill.weapon.type,
                        })),
                    });
                }
            }
        });
    }
    console.log("demosHighlights: ", JSON.stringify(demosHighlights, null, 4));
    return demosHighlights;
}
function demoIsBroken(matchData) {
    return matchData.rounds.length <= 15;
}
function getFragtype(kills, clutch) {
    console.clear();
    console.log("kills", kills);
    if (kills.length >= 3) {
        return clutch ? "clutch" : `${kills.length}k`;
    }
    if (hasDeagleHs(kills)) {
        const deagleKills = kills.filter((kill) => kill.weapon.name === "Desert Eagle");
        return `deagle${deagleKills.length}k`;
    }
    return `${kills.length}k`;
}
function hasDeagleHs(kills) {
    return kills.some((kill) => kill.weapon.name === "Desert Eagle" && kill.isHeadshot);
}
function isAntieco(playerKills, matchData, roundNr) {
    const killedSteamIds = playerKills.map((kill) => kill.killedPlayerSteamId);
    const enemyPlayers = matchData.players.filter((player) => killedSteamIds.includes(player.steamid));
    return (enemyPlayers.every((player) => player.equipement_value_rounds[roundNr] < 1000) &&
        ![1, 16].includes(roundNr));
}
module.exports = {
    getFrags,
    demoIsBroken,
    getFragtype,
    hasDeagleHs,
    isAntieco,
};

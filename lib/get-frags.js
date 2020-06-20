const fs = require("fs").promises;
const isAntieco = require("./is-antieco.js");
const path = require("path");

module.exports = async function getFrags(
  pathToJsonFiles,
  playerChosen = false
) {
  let demosHighlights = [];
  const files = await fs.readdir(pathToJsonFiles);
  const demoFiles = files.filter(
    file => path.extname(file).toLowerCase() === ".json"
  );

  for (let i = 0; i < demoFiles.length; i++) {
    const data = await fs.readFile(`${pathToJsonFiles}/${demoFiles[i]}`);
    const matchData = JSON.parse(data);
    console.log(matchData.name);

    demosHighlights.push({
      demo_name: matchData.name.replace(".dem", ""),
      map: matchData.map_name.replace("de_", ""),
      rounds_with_highlights: [],
    });

    if (matchData.rounds.length <= 15) {
      demosHighlights[
        i
      ].break_msg = `Can't extract highlights from this demo - there's only ${
        matchData.rounds.length
      } round${
        matchData.rounds.length > 1 ? "s" : ""
      } in the JSON file. The demo is probably partially corrupted, but looking through it manually in-game might work. You could also try to analyze it again in CS:GO Demos Manager, export a new JSON file and try again.`;
    } else {
      const allNotableClutchesInMatch = matchData.players
        .filter(player =>
          player.clutches.some(
            clutch => clutch.has_won && clutch.opponent_count >= 3
          )
        )
        .map(player => {
          return player.clutches
            .filter(clutch => clutch.has_won && clutch.opponent_count >= 3)
            .map(clutch => {
              const { opponent_count, round_number } = clutch;
              return {
                player: player.name,
                opponent_count,
                round_number,
              };
            });
        })
        .flat();
      matchData.rounds.forEach((currentRound, roundIndex) => {
        demosHighlights[i].rounds_with_highlights.push({
          number: currentRound.number,
          tick: Math.floor(currentRound.tick / 1000) * 1000 - 1000,
          frags: [],
        });

        let roundKillsPerPlayer = currentRound.kills.reduce((acc, kill) => {
          if (acc[kill.killer_name]) {
            acc[kill.killer_name].kills.push(kill);
          } else {
            acc[kill.killer_name] = {
              kills: [kill],
              steamId: kill.killer_steamid,
            };
          }
          return acc;
        }, {});

        if (playerChosen) {
          roundKillsPerPlayer = Object.fromEntries(
            Object.entries(roundKillsPerPlayer).filter(
              ([_, val]) => val.steamId === playerChosen
            )
          );
        }

        for (const player in roundKillsPerPlayer) {
          const currPlayer = roundKillsPerPlayer[player];

          currPlayer.kill_amount = currPlayer.kills.length;

          let fragType;

          const clutch = allNotableClutchesInMatch.find(
            clutch =>
              clutch.round_number === currentRound.number &&
              clutch.player === player
          );

          if (currPlayer.kill_amount >= 3) {
            fragType = clutch ? "clutch" : `${currPlayer.kill_amount}k`;
          } else if (
            currPlayer.kills.some(
              kill =>
                kill.weapon.weapon_name === "Desert Eagle" && kill.is_headshot
            )
          ) {
            const deagleKills = currPlayer.kills.filter(
              kill => kill.weapon.weapon_name === "Desert Eagle"
            );

            fragType = `deagle${deagleKills.length}k`;
          } else {
            fragType = `${currPlayer.kill_amount}k`;
          }

          if (currPlayer.kill_amount >= 3 || fragType.includes("deagle")) {
            const teamName = currPlayer.kills[0].killer_team
              ? currPlayer.kills[0].killer_team.includes("]")
                ? currPlayer.kills[0].killer_team.split("]")[1].trim()
                : currPlayer.kills[0].killer_team.trim()
              : "not found";

            demosHighlights[i].rounds_with_highlights[roundIndex].frags.push({
              player,
              steamId: currPlayer.steamId,
              team: teamName,
              frag_type: fragType,
              ...(clutch ? { clutch_opponents: clutch.opponent_count } : {}),
              antieco: isAntieco(currPlayer.kills, matchData, currentRound),

              individual_kills: currPlayer.kills.map(kill => ({
                timestamp: kill.time_death_seconds,
                weapon: kill.weapon.weapon_name,
                weapon_type: kill.weapon.type,
                is_headshot: kill.is_headshot,
              })),
            });
          }
        }
      });
    }
    console.log("demo scanned.");
  }
  return demosHighlights;
};

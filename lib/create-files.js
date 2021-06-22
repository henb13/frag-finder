const fs = require("fs").promises;
const { CSGO_ROUND_LENGTH } = require("../lib/utils/constants.js");
const { camelizeIsh } = require("../lib/utils/utils.js");

module.exports = async function createFiles(data) {
  await fs.writeFile("./exports/highlights.txt", "\n");
  for (const match of data) {
    let matchText = [`**playdemo ${match.demo_name}`],
      fragsFound = false,
      matchFragFormat = [];

    match.rounds_with_highlights.forEach(round => {
      const roundNumberStr =
        round.number.toString().length == 1 ? "0" + round.number : round.number;

      round.frags.forEach(frag => {
        const killAmount = frag.individual_kills.length;
        const fragType = frag.frag_type;

        const playerNameNoSpaces = camelizeIsh(frag.player);

        const fragTypeStr =
          fragType === "clutch"
            ? frag.clutch_opponents === killAmount
              ? `1v${frag.clutch_opponents}`
              : `1v${frag.clutch_opponents}-${
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
          CSGO_ROUND_LENGTH - frag.individual_kills[0].timestamp + 1;

        const lastKillTimestamp =
          CSGO_ROUND_LENGTH -
          frag.individual_kills[killAmount - 1].timestamp +
          1;

        const firstKillTimeStr =
          firstKillTimestamp - 60 > 0
            ? `1:${Math.trunc(firstKillTimestamp - 60)
                .toString()
                .padStart(2, "0")}`
            : Math.trunc(firstKillTimestamp).toString().padStart(4, "0:");

        const fragSpeed =
          firstKillTimestamp - lastKillTimestamp < 6
            ? "-fast"
            : frag.individual_kills.filter((kill, i) => {
                if (i + 1 != killAmount) {
                  return (
                    frag.individual_kills[i + 1].timestamp - kill.timestamp > 15
                  );
                }
              }).length >= 2
            ? "-spread"
            : "";

        const weaponsUsed = frag.individual_kills
          .map(kill => [kill.weapon, kill.weapon_type])
          .reduce((acc, curr) => {
            switch (curr[0]) {
              case "AK-47":
              case "M4A4":
              case "M4A1-S":
              case "CZ75-Auto": {
                let shortVersion = curr[0].substr(0, 2);
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
        let weaponsUsedStr =
          Object.keys(weaponsUsed).length === 1
            ? Object.keys(weaponsUsed)[0]
            : Object.keys(weaponsUsed)
                .map(
                  (weapon, i) =>
                    `${i === 0 ? "" : "-"}${weapon}(${weaponsUsed[weapon]})`
                )
                .join("");

        const teamBedriftsliga = camelizeIsh(frag.team);

        matchFragFormat.push({
          frag_type: fragType,
          steamId: frag.steamId,
          tick: round.tick,
          frag_format: `x._${playerNameNoSpaces}_${fragTypeStr}${
            !fragType.includes("deagle") ? "-" + weaponsUsedStr + fragSpeed : ""
          }_${match.map}_team-${teamBedriftsliga}_r${roundNumberStr}${
            frag.antieco ? "_#ANTIECO" : ""
          } ${firstKillTimeStr} (demo_gototick ${round.tick})`,
        });
      });

      fragsFound = true;
    });

    matchFragFormat.sort((a, b) => {
      if (a.frag_type === "3k" && b.frag_type != "3k") return 1;
      if (a.frag_type === "3k" && b.frag_type === "3k") return 0;
      if (a.frag_type !== "3k" && b.frag_type === "3k") return -1;
    });

    matchFragFormat.forEach(frag => {
      //Regular intended
      if (frag.frag_type === "3k") {
        if (!matchText.includes("\n         ----3k's:\n")) {
          matchText.push("\n         ----3k's:\n");
        }

        //Extra intended
        matchText.push(`               ${frag.frag_format}\n`);
      } else {
        if (!frag.frag_type.includes("deagle")) {
          matchText.push(`   ${frag.frag_format}\n`);
        }
      }
    });

    if (!fragsFound) {
      matchText.splice(
        1,
        0,
        match.break_msg
          ? `\n\n    ${match.break_msg}\n`
          : "   no frags found. \n"
      );
    }

    if (matchFragFormat[0]) {
      // matchText[0] += `@${matchFragFormat[0].tick}\n\n`;
      matchText[0] += `\n\n`;
    }

    await fs.appendFile(
      "./exports/highlights.txt",
      matchText.join("") + "\n\n\n"
    );
  }
};

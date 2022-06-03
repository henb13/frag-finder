import path from "path";
import { promises as fs } from "fs";
import { CSGO_ROUND_LENGTH, TICK_KILL_BUFFER } from "./utils/constants";
import { camelizeIsh } from "./utils/utils";
import {
  OptionsCreateFiles,
  IHighlight,
  IKill,
  IMatch,
  IMatchPrintFormatSingle,
} from "../types";

export async function createFiles(data: IMatch[], options: OptionsCreateFiles = {}) {
  const dir = path.resolve(__dirname, options.outDir || "../../exports");
  let printFileName = options.fileName || "highlights.txt";
  printFileName = printFileName.endsWith(".txt") ? printFileName : `${printFileName}.txt`;

  await fs.writeFile(`${dir}/${printFileName}`, "\n");

  for (const match of data) {
    const matchText = [`**playdemo ${match.demoName}`];
    const matchPrintFormat: IMatchPrintFormatSingle[] = [];

    match.rounds.forEach(({ roundNumber, highlights }) => {
      const roundNumberStr =
        roundNumber.toString().length === 1 ? "0" + roundNumber : roundNumber;

      highlights.forEach((h) => {
        const playerCamelized = camelizeIsh(h.playerName);
        const teamCamelized = camelizeIsh(h.team ?? "");
        const weaponsUsed = getWeaponsUsed(h.allKillsThatRoundForPlayer);
        const killAmount = h.allKillsThatRoundForPlayer.length;
        const fragTypeDetails = getFragTypeDetails(h.fragType, killAmount, h.clutchOpponents);
        const tickFirstKill = h.allKillsThatRoundForPlayer[0].tick - TICK_KILL_BUFFER;
        const fragSpeed = getFragSpeed(h.allKillsThatRoundForPlayer);
        const clockTimeFirstKill = getIngameClockTime(
          CSGO_ROUND_LENGTH - h.allKillsThatRoundForPlayer[0].time + 1
        );

        matchPrintFormat.push({
          fragType: h.fragType,
          fragCategory: h.fragCategory,
          tickFirstKill,
          fragPrintFormat: `x._${playerCamelized}_${fragTypeDetails}${
            !h.fragType.includes("deagle")
              ? `-${weaponsUsed}${fragSpeed ? `-${fragSpeed}` : ""}`
              : ""
          }_${match.map}${teamCamelized ? `_team-${teamCamelized}` : ""}_r${roundNumberStr}${
            h.isAntieco ? "_#ANTIECO" : ""
          } ${clockTimeFirstKill} (demo_gototick ${tickFirstKill})`,
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
      } else if (!fragType.includes("deagle")) {
        matchText.push(`${addSpaces(3)}${fragPrintFormat}\n`);
      }
    });

    if (!match.rounds.length) {
      matchText.splice(
        1,
        0,
        match.errorMessage
          ? `\n\n${addSpaces(4)}${match.errorMessage}\n`
          : `${addSpaces(3)}no frags found. \n`
      );
    }

    if (matchPrintFormat[0]) matchText[0] += `@${matchPrintFormat[0].tickFirstKill}\n\n`;
    await fs.appendFile(`${dir}/${printFileName}`, matchText.join("") + "\n\n\n");
  }
}

function getWeaponsUsed(kills: IKill[]): string {
  const killsPerWeapon = kills
    .map<[string, number]>((kill) => [kill.weaponName, kill.weaponType])
    .reduce<{ [key: string]: number }>((acc, curr) => {
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
          } else if (curr[0] === "HE Grenade") {
            incrementWeaponKillCount("HE", acc);
            return acc;
          } else if (curr[1] === 5) {
            incrementWeaponKillCount("shotgun", acc);
            return acc;
          } else {
            incrementWeaponKillCount(curr[0], acc);
            return acc;
          }
      }
    }, {});

  const keys = Object.keys(killsPerWeapon);

  return keys.length === 1
    ? keys[0]
    : keys
        .map<string>(
          (weapon, i) => `${i === 0 ? "" : "-"}${weapon}(${killsPerWeapon[weapon]})`
        )
        .join("");
}

function incrementWeaponKillCount(name: string, obj: { [key: string]: number }) {
  obj[name] = obj[name] + 1 || 1;
}

function getFragTypeDetails(
  fragType: IHighlight["fragType"],
  killAmount: number,
  clutchOpponents: number | undefined
) {
  if (fragType === "clutch") {
    return clutchOpponents === killAmount
      ? `1v${clutchOpponents}`
      : `1v${clutchOpponents}-${killAmount === 5 ? "ACE" : `${killAmount}k`}`;
  }
  if (fragType === "5k") {
    return "ACE";
  }
  if (fragType.includes("deagle") && Number(fragType.match(/[0-9]+/g)?.[0]) !== killAmount) {
    return `${fragType}-${killAmount}k`;
  }
  return fragType;
}

//e.g. 1v3-4k vs just 4k etc

function getFragSpeed(allKillsThatRoundForPlayer: IKill[]): "fast" | "spread" | null {
  const FAST_KILL_SEC_THRESHOLD = 6;
  const SPREAD_KILL_SEC_THRESHOLD = 15; // time elapsed between kills

  const killAmount = allKillsThatRoundForPlayer.length;

  const lastKillTimestamp =
    CSGO_ROUND_LENGTH - allKillsThatRoundForPlayer[killAmount - 1].time + 1;

  const firstKillTimestamp = CSGO_ROUND_LENGTH - allKillsThatRoundForPlayer[0].time + 1;

  if (firstKillTimestamp - lastKillTimestamp < FAST_KILL_SEC_THRESHOLD) {
    return "fast";
  }

  const killsWithNotableTimeBetween = allKillsThatRoundForPlayer.filter((kill, i) => {
    return (
      allKillsThatRoundForPlayer[i + 1]?.time - kill.time > SPREAD_KILL_SEC_THRESHOLD || false
    );
  });

  if (killsWithNotableTimeBetween.length >= 2) {
    return "spread";
  }

  return null;
}

// e.g. 0:54, 1:32 etc.

function getIngameClockTime(firstKillTimestamp: number): string {
  return firstKillTimestamp - 60 > 0
    ? `1:${Math.trunc(firstKillTimestamp - 60)
        .toString()
        .padStart(2, "0")}`
    : Math.trunc(firstKillTimestamp).toString().padStart(4, "0:");
}

function addSpaces(amount: number) {
  return " ".repeat(amount);
}

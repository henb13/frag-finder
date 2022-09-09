export interface IMatch {
  demoName: string;
  map: string;
  rounds: IRound[];
  errorMessage?: string;
}

export interface IRound {
  roundNumber: number;
  highlights: IHighlight[];
}

export interface IHighlight {
  playerName: string;
  team: string | null;
  fragType: string;
  fragCategory: IFragCategory;
  clutchOpponents?: number;
  isAntieco: boolean;
  allKillsThatRoundForPlayer: IKill[];
}

export interface IKill {
  tick: number;
  time: number;
  weaponType: number;
  weaponName: string;
  isHeadshot: boolean;
  killedPlayerSteamId: Steamid;
}

export interface IRoundKillPlayer
  extends Pick<IHighlight, "playerName" | "team" | "allKillsThatRoundForPlayer"> {
  steamid: Steamid;
}

export interface IClutch {
  playerSteamid: Steamid;
  opponentCount: number;
  roundNumber: number;
}

export interface IMatchPrintFormatSingle
  extends Pick<IHighlight, "fragType" | "fragCategory"> {
  tickFirstKill: number;
  fragPrintFormat: string;
}

/* 
  1: clutch, 4k or ace
  2: deagle 1k or 2k with a headshot
  3: 3k's 
*/
export type IFragCategory = 1 | 2 | 3;

type Steamid = string;

//TODO: FragtypeDetails ("4k", "deagle1k", "deagle2k", "3k", "ace") -- More?

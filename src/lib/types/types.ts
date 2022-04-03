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
    team: string;
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

export interface IRoundKillPlayerSingle
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

export type IFragCategory = 1 | 2 | 3;

type Steamid = string;

//TODO: FragtypeDetails

/* This file represent the JSON data */

export interface IMatchDataDTO {
    id: string;
    name: string;
    NameWithoutExtension: string;
    date: Date;
    source: string;
    comment: string;
    status: string;
    client_name: string;
    hostname: string;
    type: string;
    tickrate: number;
    server_tickrate: number;
    duration: number;
    ticks: number;
    map_name: string;
    path: string;
    cheater_count: number;
    score_team1: number;
    score_team2: number;
    score_half1_team1: number;
    score_half1_team2: number;
    score_half2_team1: number;
    score_half2_team2: number;
    "5k_count": number;
    "4k_count": number;
    "3k_count": number;
    "2k_count": number;
    "1k_count": number;
    team_ct: ITeamDTO;
    team_t: ITeamDTO;
    team_surrender: null;
    team_winner: ITeamDTO;
    rounds: IRoundDTO[];
    players: IPlayerDTO[];
    most_killing_weapon: IWeaponDTO;
    overtimes: IOvertimeDTO[];
    most_headshot_player: IMostDTO;
    most_bomb_planted_player: IMostDTO;
    most_entry_kill: IMostDTO;
    bomb_planted: IBombDTO[];
    bomb_defused: any[];
    bomb_exploded: IBombDTO[];
    kills: IKillDTO[];
    weapon_fired: IWeaponFiredDTO[];
    player_blinded_events: IPlayerBlindedEventDTO[];
    player_hurted: IPlayerHurtDTO[];
    kill_count: number;
    clutch_count: number;
    trade_kill_count: number;
    bomb_defused_count: number;
    bomb_planted_count: number;
    bomb_exploded_count: number;
    flashbang_thrown_count: number;
    smoke_thrown_count: number;
    he_thrown_count: number;
    decoy_thrown_count: number;
    molotov_thrown_count: number;
    incendiary_thrown_count: number;
    decoys: IUtilityEventDTO[];
    incendiaries: IUtilityEventDTO[];
    molotovs: IUtilityEventDTO[];
    damage_health_count: number;
    damage_armor_count: number;
    average_health_damage: number;
    kill_per_round: number;
    assist_per_round: number;
    jump_kill_count: number;
    crouch_kill_count: number;
    headshot_count: number;
    death_count: number;
    assist_count: number;
    entry_kill_count: number;
    knife_kill_count: number;
    mvp_count: number;
    teamkill_count: number;
    death_per_round: number;
    clutch_lost_count: number;
    clutch_won_count: number;
    shot_count: number;
    hit_count: number;
    average_hltv_rating: number;
    average_esea_rws: number;
    chat_messages: string[];
}

export interface IBombDTO {
    site: ISiteDTO;
    planter_steamid: string;
    planter_name: string;
    tick: number;
    seconds: number;
}

export enum ISiteDTO {
    A = "A",
    B = "B",
}

export interface IUtilityEventDTO {
    thrower_steamid: string;
    thrower_name: string;
    thrower_side: ITeamSidesDTO;
    heatmap_point: IHeatmapPointDTO;
    round_number: number;
    tick: number;
    seconds: number;
    flashed_players_steamid?: string[];
}

export interface IHeatmapPointDTO {
    X: number;
    Y: number;
}

export enum ITeamSidesDTO {
    CT = "CT",
    T = "T",
    Empty = "",
}

export interface IKillDTO {
    killer_steamid: string;
    killed_steamid: string;
    assister_steamid: string;
    weapon: IWeaponDTO;
    heatmap_point: IKillHeatmapPointDTO;
    killer_vel_x: number;
    killer_vel_y: number;
    killer_vel_z: number;
    killer_side: ITeamSidesDTO;
    killer_team: string | null;
    killed_side: ITeamSidesDTO;
    killed_team: string;
    killer_name: string;
    killed_name: string;
    assister_name: string | null;
    round_number: number;
    time_death_seconds: number;
    killer_crouching: boolean;
    killer_blinded: boolean;
    is_trade_kill: boolean;
    is_headshot: boolean;
    killer_is_controlling_bot: boolean;
    killed_is_controlling_bot: boolean;
    victim_blinded: boolean;
    assister_is_controlling_bot: boolean;
    tick: number;
    seconds: number;
}

export interface IKillHeatmapPointDTO extends IHeatmapPointDTO {
    killer_x: number;
    killer_y: number;
    victim_x: number;
    victim_y: number;
}

export interface IWeaponDTO {
    element: number;
    type: number;
    weapon_name: CommonWeaponNames | string;
}

export enum CommonWeaponNames { //TODO: Replace i getWeaponName
    Ak47 = "AK-47",
    Aug = "AUG",
    Awp = "AWP",
    Decoy = "Decoy",
    DesertEagle = "Desert Eagle",
    Famas = "Famas",
    FiveSeveN = "Five-SeveN",
    Flashbang = "Flashbang",
    GalilAR = "Galil AR",
    Glock18 = "Glock-18",
    HEGrenade = "HE Grenade",
    Incendiary = "Incendiary",
    Knife = "Knife",
    M4A1S = "M4A1-S",
    M4A4 = "M4A4",
    MAC10 = "MAC-10",
    Molotov = "Molotov",
    Mp9 = "MP9",
    P250 = "P250",
    Smoke = "Smoke",
    Ssg08 = "SSG 08",
    Tec9 = "Tec-9",
    Unknown = "Unknown",
    UspS = "USP-S",
    Xm1014 = "XM1014",
    ZeusTazer = "Zeus (Tazer)",
}

export interface IMostDTO {
    $id: string;
    steamid: string;
    name: string;
    kill_count: number;
    crouch_kill_count: number;
    jump_kill_count: number;
    score: number;
    tk_count: number;
    assist_count: number;
    trade_kill_count: number;
    trade_death_count: number;
    bomb_planted_count: number;
    bomb_defused_count: number;
    bomb_exploded_count: number;
    death_count: number;
    "5k_count": number;
    "4k_count": number;
    "3k_count": number;
    "2k_count": number;
    "1k_count": number;
    hs_count: number;
    kd: number;
    mvp_count: number;
    hltv_rating: number;
    esea_rws: number;
    shot_count: number;
    hit_count: number;
    is_vac_banned: boolean;
    is_ow_banned: boolean;
    flashbang_count: number;
    smoke_count: number;
    he_count: number;
    molotov_count: number;
    incendiary_count: number;
    decoy_count: number;
    round_count: number;
    team_name: string;
    start_money_rounds: { [key: string]: number };
    equipement_value_rounds: { [key: string]: number };
    rounds_money_earned: { [key: string]: number };
    time_death_rounds: { [key: string]: number };
    entry_kills: IEntryKillDTO[];
    entry_hold_kills: IEntryKillDTO[];
    kills: IKillDTO[];
    deaths: IKillDTO[];
    assits: IKillDTO[];
    players_hurted: IPlayerHurtDTO[];
    clutches: IClutchDTO[];
    rank_old: number;
    rank_new: number;
    win_count: number;
    entry_kill_won_count: number;
    entry_kill_loss_count: number;
    entry_hold_kill_won_count: number;
    entry_hold_kill_loss_count: number;
    clutch_count: number;
    clutch_loss_count: number;
    clutch_won_count: number;
    "1v1_won_count": number;
    "1v2_won_count": number;
    "1v3_won_count": number;
    "1v4_won_count": number;
    "1v5_won_count": number;
    "1v1_loss_count": number;
    "1v2_loss_count": number;
    "1v3_loss_count": number;
    "1v4_loss_count": number;
    "1v5_loss_count": number;
    "1v1_count": number;
    "1v2_count": number;
    "1v3_count": number;
    "1v4_count": number;
    "1v5_count": number;
    suicide_count: number;
    total_damage_health_done: number;
    total_damage_armor_done: number;
    total_damage_health_received: number;
    total_damage_armor_received: number;
    average_health_damage: number;
    kill_per_round: number;
    assist_per_round: number;
    death_per_round: number;
    total_time_death: number;
    avg_time_death: number;
}

export interface IClutchDTO {
    opponent_count: number;
    has_won: boolean;
    round_number: number;
    tick: number;
    seconds: number;
}

export interface IEntryKillDTO {
    round_number: number;
    killer_steamid: string;
    killer_name: string;
    killer_side: ITeamSidesDTO;
    killed_steamid: string;
    killed_name: string;
    killed_side: ITeamSidesDTO;
    weapon: IWeaponDTO;
    has_won: boolean;
    has_won_round: boolean;
    tick: number;
    seconds: number;
}

export interface IPlayerHurtDTO {
    hurted_steamid: string;
    attacker_steamid: string;
    attacker_side: ITeamSidesDTO;
    armor_damage: number;
    health_damage: number;
    hitgroup: number;
    weapon: IWeaponDTO;
    round_number: number;
    victim_x: number;
    victim_y: number;
    attacker_x: number;
    attacker_y: number;
    tick: number;
    seconds: number;
}

export interface IOvertimeDTO {
    number: number;
    score_team_ct: number;
    score_team_t: number;
}

export interface IPlayerBlindedEventDTO {
    thrower_steamid: string;
    thrower_name: string;
    thrower_team_name: string;
    victim_steamid: string;
    victim_name: string;
    victim_team_name: string;
    round_number: number;
    duration: number;
    tick: number;
    seconds: number;
}

export interface IPlayerDTO {
    steamid: string;
    name: string;
    kill_count: number;
    crouch_kill_count: number;
    jump_kill_count: number;
    score: number;
    tk_count: number;
    assist_count: number;
    trade_kill_count: number;
    trade_death_count: number;
    bomb_planted_count: number;
    bomb_defused_count: number;
    bomb_exploded_count: number;
    death_count: number;
    "5k_count": number;
    "4k_count": number;
    "3k_count": number;
    "2k_count": number;
    "1k_count": number;
    hs_count: number;
    kd: number;
    mvp_count: number;
    hltv_rating: number;
    esea_rws: number;
    shot_count: number;
    hit_count: number;
    is_vac_banned: boolean;
    is_ow_banned: boolean;
    flashbang_count: number;
    smoke_count: number;
    he_count: number;
    molotov_count: number;
    incendiary_count: number;
    decoy_count: number;
    round_count: number;
    team_name: string;
    start_money_rounds: { [key: string]: number };
    equipement_value_rounds: { [key: string]: number };
    rounds_money_earned: { [key: string]: number };
    time_death_rounds: { [key: string]: number };
    entry_kills: IEntryKillDTO[];
    entry_hold_kills: IEntryKillDTO[];
    kills: IKillDTO[];
    deaths: IKillDTO[];
    assits: IKillDTO[];
    players_hurted: IPlayerHurtDTO[];
    clutches: IClutchDTO[];
    rank_old: number;
    rank_new: number;
    win_count: number;
    entry_kill_won_count: number;
    entry_kill_loss_count: number;
    entry_hold_kill_won_count: number;
    entry_hold_kill_loss_count: number;
    clutch_count: number;
    clutch_loss_count: number;
    clutch_won_count: number;
    "1v1_won_count": number;
    "1v2_won_count": number;
    "1v3_won_count": number;
    "1v4_won_count": number;
    "1v5_won_count": number;
    "1v1_loss_count": number;
    "1v2_loss_count": number;
    "1v3_loss_count": number;
    "1v4_loss_count": number;
    "1v5_loss_count": number;
    "1v1_count": number;
    "1v2_count": number;
    "1v3_count": number;
    "1v4_count": number;
    "1v5_count": number;
    suicide_count: number;
    total_damage_health_done: number;
    total_damage_armor_done: number;
    total_damage_health_received: number;
    total_damage_armor_received: number;
    average_health_damage: number;
    kill_per_round: number;
    assist_per_round: number;
    death_per_round: number;
    total_time_death: number;
    avg_time_death: number;
}

export interface IRoundDTO {
    number: number;
    tick: number;
    end_tick: number;
    end_tick_officially: number;
    freezetime_end_tick: number;
    end_reason: EndReason;
    kills: IKillDTO[];
    winner_side: ITeamSidesDTO;
    winner_name: string;
    team_t_name: string;
    team_ct_name: string;
    kill_count: number;
    "5k_count": number;
    "4k_count": number;
    "3k_count": number;
    "2k_count": number;
    "1k_count": number;
    jump_kill_count: number;
    crouch_kill_count: number;
    trade_kill_count: number;
    equipement_value_team_t: number;
    equipement_value_team_ct: number;
    start_money_team_t: number;
    start_money_team_ct: number;
    bomb_defused_count: number;
    bomb_exploded_count: number;
    bomb_planted_count: number;
    entry_kill: IEntryKillDTO | null;
    entry_hold_kill: IEntryKillDTO | null;
    bomb_planted: IBombDTO | null;
    bomb_defused: null;
    bomb_exploded: IBombDTO | null;
    type: number;
    team_trouble_name: string | null;
    side_trouble: ITeamSidesDTO;
    flashbang_thrown_count: number;
    smoke_thrown_count: number;
    he_thrown_count: number;
    decoy_thrown_count: number;
    molotov_thrown_count: number;
    incendiary_thrown_count: number;
    players_hurted: IPlayerHurtDTO[];
    weapon_fired: IWeaponFiredDTO[];
    duration: number;
    damage_health_count: number;
    damage_armor_count: number;
    average_health_damage_per_player: number;
    flashbangs_exploded: IUtilityEventDTO[];
    smokes_started: IUtilityEventDTO[];
    he_exploded: IUtilityEventDTO[];
}

export enum EndReason {
    BombExploded = "Bomb exploded",
    CounterTerroristsWin = "Counter-Terrorists win",
    TerroristsWin = "Terrorists win",
}

export interface IWeaponFiredDTO {
    heatmap_point: IHeatmapPointDTO;
    shooter_steamid: string;
    shooter_name: string;
    shooter_side: ITeamSidesDTO;
    weapon: IWeaponDTO;
    round_number: number;
    shooter_vel_x: number;
    shooter_vel_y: number;
    shooter_vel_z: number;
    shooter_pos_x: number;
    shooter_pos_y: number;
    shooter_pos_z: number;
    shooter_angle_pitch: number;
    shooter_angle_yaw: number;
    tick: number;
    seconds: number;
}

export interface ITeamDTO {
    team_name: string;
    score: number;
    score_first_half: number;
    score_second_half: number;
    team_players: IPlayerDTO[];
    $id?: string;
}

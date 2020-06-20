function isAntieco(playerKills, matchData, { number: roundNr }) {
  const killedSteamIds = playerKills.map(kill => kill.killed_steamid);
  const enemyPlayers = matchData.players.filter(player =>
    killedSteamIds.includes(player.steamid)
  );

  return (
    enemyPlayers.every(player => player.start_money_rounds[roundNr] < 2900) &&
    ![1, 16].includes(roundNr)
  );
}
module.exports = isAntieco;

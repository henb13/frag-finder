function isAntieco(playerKills, matchData, { number: roundNr }) {
  const killedSteamIds = playerKills.map(kill => kill.killed_steamid);
  const enemyPlayers = matchData.players.filter(player =>
    killedSteamIds.includes(player.steamid)
  );

  return (
    enemyPlayers.every(
      player => player.equipement_value_rounds[roundNr] < 1000
    ) && ![1, 16].includes(roundNr)
  );
}
module.exports = isAntieco;

// Mapping of game names to their logo URLs from public folder

export const gameLogos = {
  'PUBGM': '/pubgm.jpg',
  'CODM': '/codm.png',
  'eFootball': '/efootball.png',
  'FC Mobile': '/fcmobile.jpg',
  'DLS': '/dls.png',
  'Free Fire': '/freefire.png'
};

export const getGameLogo = (gameName) => {
  return gameLogos[gameName] || '/logo.png';
};

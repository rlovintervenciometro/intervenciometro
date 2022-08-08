function getRandomValue(auxMin, auxMax) {
  const min = Math.ceil(auxMin);
  const max = Math.floor(auxMax);
  return Math.floor(Math.random() * (max - min) + min);
}

export default getRandomValue;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random from element from an array
 *
 * @param array
 * @param random
 * @returns
 */
export function getRandomFromArray<T = any>(array: T[]) {
  return array[getRandomInt(0, array.length - 1)];
}

export function RGBtoHEX(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b;
}

export function hexToRgb(hex: number) {
  var bigint = hex;
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return { r, g, b };
}

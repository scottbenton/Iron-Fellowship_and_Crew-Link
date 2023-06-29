export function getHueFromString(str: string = "") {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash % 360;
}

export function getHSLFromString(
  str: string = "",
  saturation: number,
  lightness: number
) {
  const hue = getHueFromString(str);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function hslToHex(hue: number, saturation: number, lightness: number) {
  lightness /= 100;
  const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
  const convert = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${convert(0)}${convert(8)}${convert(4)}`;
}

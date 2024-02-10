export class ColorHelper {
  public static hslToHex(hue: number, saturation: number, lightness: number): string {
    hue /= 360;
    saturation /= 100;
    lightness /= 100;

    let red: number;
    let green: number;
    let blue: number;

    if (saturation === 0) {
      red = green = blue = lightness; // achromatic
    } else {
      const hueToRgb = (temp1: number, temp2: number, hue: number): number => {
        if (hue < 0) {
          hue += 1;
        }
        if (hue > 1) {
          hue -= 1;
        }
        if (hue < 1 / 6) {
          return temp1 + (temp2 - temp1) * 6 * hue;
        }
        if (hue < 1 / 2) {
          return temp2;
        }
        if (hue < 2 / 3) {
          return temp1 + (temp2 - temp1) * (2 / 3 - hue) * 6;
        }
        return temp1;
      };

      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      red = hueToRgb(p, q, hue + 1 / 3);
      green = hueToRgb(p, q, hue);
      blue = hueToRgb(p, q, hue - 1 / 3);
    }

    const toHex = (x: number): string => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  }
}

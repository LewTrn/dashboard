/* ----------------------------------------
    Colour Conversion
---------------------------------------- */
// Source: https://css-tricks.com/converting-color-spaces-in-javascript/
/* eslint-disable */
  
// Convert RGB to Hex
function RGBToHex(rgb) {
  const sep = rgb.indexOf(',') > -1 ? ',' : ' ';

  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(')')[0].split(sep);

  let r = (+rgb[0]).toString(16);
  let g = (+rgb[1]).toString(16);
  let b = (+rgb[2]).toString(16);

  if (r.length === 1)
    r = `0${  r}`;
  if (g.length === 1)
    g = `0${  g}`;
  if (b.length === 1)
    b = `0${  b}`;

  return `#${r}${g}${b}`
}

// Convert Hex to RGB
function hexToRGB(h) {
  let r = 0; 
  let g = 0; 
  let b = 0;

  // Filter for 3 or 6 digits
  if (h.length === 4) {
    r = `0x${  h[1]  }${h[1]}`;
    g = `0x${  h[2]  }${h[2]}`;
    b = `0x${  h[3]  }${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${  h[1]  }${h[2]}`;
    g = `0x${  h[3]  }${h[4]}`; 
    b = `0x${  h[5]  }${h[6]}`;
  }
  
  return `rgb(${+r}, ${+g}, ${+b})`;
}

// Convert HSL to RGB
function HSLToRGB(hsl) {
  const sep = hsl.indexOf(',') > -1 ? ',' : ' ';
  hsl = hsl.substr(4).split(')')[0].split(sep);

  const h = hsl[0];
  const s = hsl[1].substr(0,hsl[1].length - 1) / 100;
  const l = hsl[2].substr(0,hsl[2].length - 1) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

// Convert RGB to HSL
function RGBToHSL(rgb) {
  const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  rgb = rgb.substr(4).split(')')[0].split(sep);

  for (const R in rgb) {
    const r = rgb[R];
    if (r.indexOf('%') > -1)
      rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
  }

  // Make r, g, and b fractions of 1
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const cmin = Math.min(r,g,b);
  const cmax = Math.max(r,g,b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0)
    h = 0;
  else if (cmax === r)
    h = ((g - b) / delta) % 6;
  else if (cmax === g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

/* ----------------------------------------
    Card Scripts
---------------------------------------- */
// Colour Code Regex Tests
function toRGB(code) {
  const regex = {
    hex: /^#([\da-f]{3}){1,2}$/i,
    rgb: /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i,
    hsl: /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i
  }

  // Return valid colours as RGB
  if (regex.hex.test(code)) 
    return hexToRGB(code);
  if (regex.rgb.test(code))
    return hexToRGB(RGBToHex(code));
  if (regex.hsl.test(code))
    return HSLToRGB(code);

  return false;
}
import chroma from 'chroma-js';

const SA98G = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.0721750,
  normBG: 0.56,
  normTXT: 0.57,
  revBG: 0.62,
  revTXT: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  loClip: 0.1,
  deltaYmin: 0.0005,
};

function sRGBtoY(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => Math.pow(c / 255, SA98G.mainTRC));
  return r * SA98G.sRco + g * SA98G.sGco + b * SA98G.sBco;
}

function softClamp(Y: number): number {
  return Y > SA98G.blkThrs ? Y : Y + Math.pow(SA98G.blkThrs - Y, SA98G.blkClmp);
}

export function calcAPCA(textColor: string, bgColor: string): number {
  const txtRGB = chroma(textColor).rgb() as [number, number, number];
  const bgRGB = chroma(bgColor).rgb() as [number, number, number];

  let txtY = softClamp(sRGBtoY(txtRGB));
  let bgY = softClamp(sRGBtoY(bgRGB));

  const deltaY = Math.abs(bgY - txtY);
  if (deltaY < SA98G.deltaYmin) return 0;

  let contrast: number;
  if (bgY > txtY) {
    contrast = (Math.pow(bgY, SA98G.normBG) - Math.pow(txtY, SA98G.normTXT)) * SA98G.scaleBoW;
    contrast = contrast < SA98G.loClip ? 0 : contrast - SA98G.loBoWoffset;
  } else {
    contrast = (Math.pow(bgY, SA98G.revBG) - Math.pow(txtY, SA98G.revTXT)) * SA98G.scaleWoB;
    contrast = contrast > -SA98G.loClip ? 0 : contrast + SA98G.loWoBoffset;
  }

  return Math.round(contrast * 100) / 100;
}

export function getContrastLevel(apcaValue: number): 'pass' | 'warning' | 'fail' {
  const abs = Math.abs(apcaValue);
  if (abs >= 60) return 'pass';
  if (abs >= 45) return 'warning';
  return 'fail';
}

export function getMinContrast(textSize: 'body' | 'large' | 'small'): number {
  switch (textSize) {
    case 'large': return 45;
    case 'body': return 60;
    case 'small': return 75;
  }
}

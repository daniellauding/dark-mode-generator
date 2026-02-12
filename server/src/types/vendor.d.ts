declare module 'apca-w3' {
  export function APCAcontrast(txtY: number, bgY: number): number;
  export function sRGBtoY(srgb: [number, number, number]): number;
}

declare module 'colorparsley' {
  export function colorParsley(color: string): [number, number, number];
}

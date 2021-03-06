import QRCode from "./qrcode";

let seed = Math.random() * 233280;
export function rand(min: number, max: number) {
  seed = (seed * 9301 + 49297) % 233280;
  return min + (seed / 233280.0) * (max - min);
}

export function defaultViewBox(qrcode: QRCode | undefined, size = 2) {
  if (!qrcode) return '0 0 0 0';

  const nCount = qrcode.getModuleCount();
  return String(-size) + ' ' + String(-size) + ' ' + String(nCount + size * 2) + ' ' + String(nCount + size * 2);
}

export function gamma(r: number, g: number, b: number) {
  return Math.pow((Math.pow(r, 2.2) + Math.pow(1.5 * g, 2.2) + Math.pow(0.6 * b, 2.2)) / (1 + Math.pow(1.5, 2.2) + Math.pow(0.6, 2.2)), 1 / 2.2)
}

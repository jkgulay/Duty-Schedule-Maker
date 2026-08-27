const DARK = '#1f2937';
const LIGHT = '#ffffff';

/**
 * Picks black or white text for a given background hex so the pair stays
 * legible, using the WCAG relative-luminance threshold.
 */
export function readableTextColor(backgroundHex: string): string {
  const hex = backgroundHex.replace('#', '');
  if (hex.length !== 6) {
    return DARK;
  }
  const channels = [0, 2, 4].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [r, g, b] = channels as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.179 ? DARK : LIGHT;
}

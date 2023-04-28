
export const stringWithEllipsis = (s: string): string => {
  return s.substring(0, 9) + (s.length > 8 ? ("..." + s.substring(Math.max(s.length-8, 9))): "");
}
import Address from "../types/address";

export const stringWithEllipsis = (s: string, len: number=9): string => {
  return s.substring(0, len) + (s.length > len - 1 ? ("..." + s.substring(Math.max(s.length-(len - 1), len))): "");
}

export const copyAddress = (content: string): void => {
  navigator.clipboard.writeText(content);
}
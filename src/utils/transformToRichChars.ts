import { RichChar } from "./types";

/**
 * Transforms string (char[]) to RichChar[]
 *
 * Each character in the string is wrapped in a RichChar object, which includes
 * extra metadata fields such as its original index and whether it should be
 * hidden.
 */
export default function transformToRichChars(
  text: string,
  hiddenCharIndexes: number[],
): RichChar[] {
  return text.split("").map((char, i) => ({
    isHidden: hiddenCharIndexes.includes(i),
    originalIndex: i,
    // TODO: I don't like using underscore as placeholder
    char: char === "_" ? "" : char,
  }));
}

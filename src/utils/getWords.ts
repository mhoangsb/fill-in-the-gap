import { Word, RichChar } from "./types";

/**
 * This function transforms RichChar[] into Word[]
 *
 * Let's say we have this input RichChar[]:
 * "a brown fox jumps over a lazy dog"
 *
 * then Word[] output will be:
 * ["a", "brown", "fox", ... so on]
 */
export default function getWords(richChars: RichChar[]): Word[] {
  const words: Word[] = [];

  let tempWord: RichChar[] = [];

  for (let i = 0; i < richChars.length; ++i) {
    const char = richChars[i];

    if (!char.isHidden && char.char === " ") {
      words.push(tempWord);
      tempWord = [];
    }

    tempWord.push(char);
  }

  if (tempWord.length) {
    words.push(tempWord);
  }

  return words;
}

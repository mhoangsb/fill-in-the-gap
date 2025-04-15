import { getRandomQuote } from "./quoteUtils";

export type Question = {
  text: string;
  author: string;
  missingCharacterIndexes: number[];

  /**
   * quoteId is the index of quote in quotes array
   */
  quoteId: number;
};

export default function generateQuestion(currentScore: number): Question {
  const randomQuote = getRandomQuote();

  const missingCharIndexes: number[] = [];

  const numOfMissingChars = getNumberOfMissingCharacters(
    currentScore,
    randomQuote.text.length,
  );
  let numOfMissingCharsGenerated = 0;
  let loopCount = 0;
  const quoteContent = randomQuote.text;
  while (numOfMissingCharsGenerated < numOfMissingChars) {
    loopCount++;
    if (loopCount > 1000) {
      throw new Error("Infinity loop while generate missing characters indexes");
    }

    const randomIndex = generateRandomNumber(0, quoteContent.length);

    if (
      isLetter(quoteContent[randomIndex]) &&
      !missingCharIndexes.includes(randomIndex)
    ) {
      missingCharIndexes.push(randomIndex);
      numOfMissingCharsGenerated++;
    }
  }

  const quoteTextWithHiddenChars = randomQuote.text
    .split("")
    .map((char, i) => {
      if (missingCharIndexes.includes(i)) {
        return "_";
      }

      return char;
    })
    .join("");

  return {
    text: quoteTextWithHiddenChars,
    author: randomQuote.author,
    missingCharacterIndexes: missingCharIndexes,
    quoteId: randomQuote.index,
  };
}

function isLetter(char: string): boolean {
  return /^[a-zA-Z]$/.test(char);
}

function generateRandomNumber(minInclusive: number, maxExclusive: number): number {
  return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

function getNumberOfMissingCharacters(currentScore: number, quoteLength: number): number {
  const LOWER_LIMIT = 1;
  const UPPER_LIMIT = Math.floor((quoteLength * 30) / 100);

  const clamp = (x: number): number => {
    if (x <= LOWER_LIMIT) {
      return LOWER_LIMIT;
    }

    if (x >= UPPER_LIMIT) {
      return UPPER_LIMIT;
    }

    return x;
  };

  if (currentScore <= 2) {
    return clamp(2);
  }

  if (currentScore <= 4) {
    return clamp(3);
  }

  if (currentScore <= 8) {
    return clamp(5);
  }

  if (currentScore <= 12) {
    return clamp(8);
  }

  if (currentScore <= 16) {
    return clamp(10);
  }

  if (currentScore <= 20) {
    return clamp(15);
  }

  if (currentScore <= 25) {
    return clamp(20);
  }

  return clamp(99);
}

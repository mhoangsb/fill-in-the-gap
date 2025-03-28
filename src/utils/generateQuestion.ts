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
  const step = 5;

  let percentage = currentScore * step;

  if (percentage > 30) {
    percentage = 30;
  }
  if (percentage < 5) {
    percentage = 5;
  }

  let numOfMissingChars = Math.floor((quoteLength / 100) * percentage);

  if (numOfMissingChars < 1) {
    numOfMissingChars = 1;
  }

  return numOfMissingChars;
}

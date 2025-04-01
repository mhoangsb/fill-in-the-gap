import "server-only";

import { quotes } from "./quotes";

type Quote = {
  text: string;
  author: string;
  index: number;
};

export function getRandomQuote(): Quote {
  const numOfQuotes = quotes.length;
  const randomIndex = Math.floor(Math.random() * numOfQuotes);
  const quote = quotes[randomIndex];

  return {
    text: quote.quoteText,
    // In the quotes array, some quote have author = ""
    // If so, return "Anonymous" instead
    author: quote.quoteAuthor || "Anonymous",
    index: randomIndex,
  };
}

export function getQuoteByIndex(index: number): Quote {
  if (index < 0 || index >= quotes.length) {
    throw new Error("Invalid index");
  }

  const quote = quotes[index];

  return {
    text: quote.quoteText,
    author: quote.quoteAuthor,
    index,
  };
}

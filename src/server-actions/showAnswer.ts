"use server";

import "server-only";

import { ServerActionResult } from "@/utils/types";
import prisma from "@/utils/prisma";
import { HEALTH_COST_SHOW_ANSWER, NULL_QUESTION_ID } from "@/utils/constants";
import { getQuoteByIndex } from "@/utils/quoteUtils";

type ShowAnswerResult = {
  originQuote: string;
};

enum ShowAnswerErrorCode {
  NoMatchFound,
  NoOngoingQuestion,
}

export default async function showAnswer(
  matchToken: string,
): Promise<ServerActionResult<ShowAnswerResult>> {
  const match = await prisma.match.findUnique({
    where: {
      cryptographicallyStrongRandomToken: matchToken,
    },
  });

  if (!match) {
    return {
      isOk: false,
      errorMessage: "Error: No match found with the given matchToken",
      errorCode: ShowAnswerErrorCode.NoMatchFound,
    };
  }

  if (match.currentQuestionId === NULL_QUESTION_ID) {
    return {
      isOk: false,
      errorMessage: "Error: Match does not have ongoing question",
      errorCode: ShowAnswerErrorCode.NoOngoingQuestion,
    };
  }

  const newHealth = match.currentHealth - HEALTH_COST_SHOW_ANSWER;
  await prisma.match.update({
    where: {
      cryptographicallyStrongRandomToken: matchToken,
    },
    data: {
      currentHealth: newHealth,
    },
  });

  const originQuote = getQuoteByIndex(match.currentQuestionId);

  return {
    isOk: true,
    payload: {
      originQuote: originQuote.text,
    },
  };
}

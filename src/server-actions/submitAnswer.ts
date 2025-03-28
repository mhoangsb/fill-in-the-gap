"use server";

import "server-only";

import {
  HEALTH_BOOST,
  HEALTH_PENALTY_WRONG_ANSWER,
  NULL_QUESTION_ID,
  SCORE_PER_HEALTH_BOOST,
} from "@/utils/constants";
import prisma from "@/utils/prisma";
import { getQuoteByIndex } from "@/utils/quoteUtils";
import { ServerActionResult } from "@/utils/types";

type SubmitAnswerResult = {
  isCorrect: boolean;
};

enum SubmitAnswerErrorCode {
  NoMatchFound,
  InvalidHealth,
  NoOngoingQuestion,
}

export default async function submitAnswer(
  matchToken: string,
  answer: string,
): Promise<ServerActionResult<SubmitAnswerResult>> {
  const match = await prisma.match.findUnique({
    where: {
      cryptographicallyStrongRandomToken: matchToken,
    },
  });

  if (!match) {
    return {
      isOk: false,
      errorMessage: "Error: No match found with the given matchToken",
      errorCode: SubmitAnswerErrorCode.NoMatchFound,
    };
  }

  if (match.currentHealth <= 0) {
    return {
      isOk: false,
      errorMessage: "Error: Invalid current health. Health must be above 0",
      errorCode: SubmitAnswerErrorCode.InvalidHealth,
    };
  }

  if (match.currentQuestionId === NULL_QUESTION_ID) {
    return {
      isOk: false,
      errorMessage: "Error: Match does not have ongoing question",
      errorCode: SubmitAnswerErrorCode.NoOngoingQuestion,
    };
  }

  const originQuote = getQuoteByIndex(match.currentQuestionId);
  const isAnswerCorrect = originQuote.text.toLowerCase() === answer.toLowerCase();

  if (!isAnswerCorrect) {
    await prisma.match.update({
      where: {
        cryptographicallyStrongRandomToken: matchToken,
      },
      data: {
        currentHealth: match.currentHealth - HEALTH_PENALTY_WRONG_ANSWER,
      },
    });

    return {
      isOk: true,
      payload: {
        isCorrect: false,
      },
    };
  }

  // Code from here is for correct answer case

  const newScore = match.currentScore + 1;
  const newHealth =
    // Don't need to worry about newScore == 0 because this code only runs
    // if user answers (at least 1) correct question => score must be > 0
    newScore % SCORE_PER_HEALTH_BOOST === 0
      ? match.currentHealth + HEALTH_BOOST
      : match.currentHealth;

  await prisma.match.update({
    where: {
      cryptographicallyStrongRandomToken: matchToken,
    },
    data: {
      currentQuestionId: NULL_QUESTION_ID,
      currentScore: newScore,
      currentHealth: newHealth,
    },
  });

  return {
    isOk: true,
    payload: {
      isCorrect: true,
    },
  };
}

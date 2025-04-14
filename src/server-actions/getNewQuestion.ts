"use server";

import "server-only";

import prisma from "@/utils/prisma";
import { NULL_QUESTION_ID } from "@/utils/constants";
import generateQuestion from "@/utils/generateQuestion";
import { ServerActionResult } from "@/utils/types";

export type QuestionSendToClient = {
  text: string;
  author: string;
  hiddenCharIndexes: number[];
};

enum GetNewQuestionErrorCode {
  NoMatchFound,
  InvalidHealth,
  OngoingQuestion,
}

export default async function getNewQuestion(
  matchToken: string,
): Promise<ServerActionResult<QuestionSendToClient>> {
  const match = await prisma.match.findUnique({
    where: {
      cryptographicallyStrongRandomToken: matchToken,
    },
  });

  if (!match) {
    return {
      isOk: false,
      errorMessage: "Error: No match found with the given matchToken",
      errorCode: GetNewQuestionErrorCode.NoMatchFound,
    };
  }

  if (match.currentHealth <= 0) {
    return {
      isOk: false,
      errorMessage: "Error: Invalid current health. Health must be above 0",
      errorCode: GetNewQuestionErrorCode.InvalidHealth,
    };
  }

  const isThereOngoingQuestion = match.currentQuestionId !== NULL_QUESTION_ID;
  if (isThereOngoingQuestion) {
    return {
      isOk: false,
      errorMessage: "Error: Match has ongoing question",
      errorCode: GetNewQuestionErrorCode.OngoingQuestion,
    };
  }

  const currentScore = match.currentScore;

  const newQuestion = generateQuestion(currentScore);

  await prisma.match.update({
    where: {
      cryptographicallyStrongRandomToken: matchToken,
    },
    data: {
      currentQuestionId: newQuestion.quoteId,
    },
  });

  return {
    isOk: true,
    payload: {
      // Do not pass in newQuestion.quoteId
      text: newQuestion.text,
      author: newQuestion.author,
      hiddenCharIndexes: newQuestion.missingCharacterIndexes,
    },
  };
}

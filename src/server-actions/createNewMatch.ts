"use server";

import "server-only";

import prisma from "@/utils/prisma";
import generateCryptographicallyStrongRandomToken from "@/utils/generateCryptographicallyStrongRandomToken";
import { INITIAL_HEALTH, INITIAL_SCORE, NULL_QUESTION_ID } from "@/utils/constants";

/**
 * Create, initialize match value in database, then return match id
 */
export default async function createNewMatch(): Promise<string> {
  const randomToken = await generateCryptographicallyStrongRandomToken();

  const newMatch = await prisma.match.create({
    data: {
      cryptographicallyStrongRandomToken: randomToken,
      currentHealth: INITIAL_HEALTH,
      currentScore: INITIAL_SCORE,
      currentQuestionId: NULL_QUESTION_ID,
    },
  });

  return newMatch.cryptographicallyStrongRandomToken;
}

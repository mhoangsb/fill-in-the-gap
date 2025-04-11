"use server";

import { auth } from "@/auth";
import prisma from "@/utils/prisma";

export default async function saveMatchResult(matchToken: string): Promise<void> {
  const session = await auth();

  if (!session) {
    throw new Error("User has not logged in.");
  }

  if (!session.user?.email) {
    throw new Error("Cannot obtain user email after user has logged in.");
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      matches: {
        connect: {
          cryptographicallyStrongRandomToken: matchToken,
        },
      },
    },
  });
}

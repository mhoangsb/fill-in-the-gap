"use server";

import { auth } from "@/auth";
import prisma from "@/utils/prisma";
import { ServerActionResult } from "@/utils/types";
import { Prisma } from "@/../generated/prisma";
import { ChangeDisplayNameServerActionErrorCode } from "@/utils/types";
import { revalidatePath } from "next/cache";

export default async function changeDisplayName(
  newName: string,
): Promise<ServerActionResult<string>> {
  const session = await auth();

  if (!session) {
    return {
      isOk: false,
      errorCode: ChangeDisplayNameServerActionErrorCode.NotAuthenticated,
      errorMessage: "Not logged in yet",
    };
  }

  if (!session.user?.email) {
    throw new Error("Cannot obtain email after user has logged in");
  }

  try {
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        displayName: newName,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        isOk: false,
        errorCode: ChangeDisplayNameServerActionErrorCode.NameExisted,
        errorMessage: `Name "${newName}" existed`,
      };
    }

    // There is also a case that prisma.user.update() throw error because
    // user with the given email does not exist in the database
    // but because I already add user to DB the first time they log in,
    // I don't need to return an error code in this case
    // If this case happen, my code is flawed and the error should be re-thrown

    throw e;
  }

  revalidatePath("/profile");

  return {
    isOk: true,
    payload: newName,
  };
}

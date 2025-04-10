import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/utils/prisma";
import { nanoid } from "nanoid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: async ({ user }): Promise<true> => {
      if (!user.email) {
        throw new Error("Cannot obtain email after user logging in");
      }

      const userInDB = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!userInDB) {
        const uuid = nanoid(10);

        const newDisplayName = (user.name || "Anonymous") + "-" + uuid;

        await prisma.user.create({
          data: {
            email: user.email,
            displayName: newDisplayName,
          },
        });
      }

      return true;
    },
  },
});

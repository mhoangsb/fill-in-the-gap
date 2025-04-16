import prisma from "@/utils/prisma";

import OnlyRenderOnClient from "@/components/OnlyRenderOnClient";
import Matches from "./_components/Matches";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const NUM_OF_MATCHES_SHOWN = 20;

  const matchesWithHighestScore = await prisma.match.findMany({
    where: {
      userEmail: { not: null },
    },
    orderBy: [
      {
        currentScore: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
    include: {
      user: true,
    },
    take: NUM_OF_MATCHES_SHOWN,
  });

  return (
    <div className="mx-auto mt-28 max-w-4xl px-4 sm:px-10">
      <h1 className="border-b-2 border-dashed border-gray-600 pb-1 text-lg">
        {`Top ${NUM_OF_MATCHES_SHOWN} điểm cao`}
      </h1>

      <OnlyRenderOnClient>
        <Matches
          matches={matchesWithHighestScore.map((match) => ({
            // Can use ! here because in the code above,
            // I only query match with user not null
            userDisplayName: match.user!.displayName,
            currentScore: match.currentScore,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
          }))}
        />
      </OnlyRenderOnClient>
    </div>
  );
}

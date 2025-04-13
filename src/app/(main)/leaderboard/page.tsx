import prisma from "@/utils/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

      <Table className="text-base">
        <TableCaption className="sr-only">Điểm cao</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Người chơi</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-center">Điểm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchesWithHighestScore.map((match, i) => (
            // Use ! to tell TS that match.user cannot be null
            // Because I only query matches with not null user
            <TableRow key={match.createdAt.toString() + match.user!.displayName}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{match.user!.displayName}</TableCell>
              <TableCell>{match.updatedAt.toLocaleString("vi-VN")}</TableCell>
              <TableCell className="text-center">{match.currentScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

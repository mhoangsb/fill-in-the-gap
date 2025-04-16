"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Match } from "@/../generated/prisma";

export default function Matches({
  matches,
  userDisplayName,
}: {
  matches: Omit<
    Match,
    "cryptographicallyStrongRandomToken" | "currentQuestionId" | "userEmail"
  >[];
  userDisplayName: string;
}) {
  return (
    <Table className="text-base">
      <TableCaption className="sr-only">Lịch sử chơi</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Người chơi</TableHead>
          <TableHead>Thời gian</TableHead>
          <TableHead className="text-center">Điểm</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.createdAt.toString()}>
            <TableCell>{userDisplayName}</TableCell>
            <TableCell>{match.updatedAt.toLocaleString("vi-VN")}</TableCell>
            <TableCell className="text-center">{match.currentScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

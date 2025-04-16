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

export default function Matches({
  matches,
}: {
  matches: {
    createdAt: Date;
    updatedAt: Date;
    userDisplayName: string;
    currentScore: number;
  }[];
}) {
  return (
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
        {matches.map((match, i) => (
          <TableRow key={match.createdAt.toString() + match.userDisplayName}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{match.userDisplayName}</TableCell>
            <TableCell>{match.updatedAt.toLocaleString("vi-VN")}</TableCell>
            <TableCell className="text-center">{match.currentScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

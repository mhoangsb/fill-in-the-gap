import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { HEALTH_COST_SHOW_ANSWER } from "@/utils/constants";

export default function NotEnoughHealthToShowAnswerDialog({
  currentHealth,
  isDialogOpen,
  onOpenChange,
  onUserShowAnswerAnyway,
}: {
  currentHealth: number;
  isDialogOpen: boolean;
  onOpenChange(open: boolean): void;
  onUserShowAnswerAnyway(): void;
}) {
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Máu của bạn đang quá thấp</AlertDialogTitle>
          <AlertDialogDescription>
            {`Cần ${HEALTH_COST_SHOW_ANSWER} máu để hiện đáp án. Bạn đang có ${currentHealth} máu. Vòng chơi sẽ kết thúc nếu bạn đồng ý hiện đáp án.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onUserShowAnswerAnyway}>
            Vẫn hiện đáp án
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

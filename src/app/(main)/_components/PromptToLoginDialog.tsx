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

export default function PromptToLoginDialog({
  isDialogOpen,
  onOpenChange,
  onUserProcessAnonymously,
  onUserProcessWithLogin,
}: {
  isDialogOpen: boolean;
  onOpenChange(open: boolean): void;
  onUserProcessAnonymously(): void;
  onUserProcessWithLogin(): void;
}) {
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đăng nhập để sử dụng thêm tính năng</AlertDialogTitle>
          <AlertDialogDescription>
            Đăng nhập để lưu lịch sử chơi và tham gia vào bảng xếp hạng.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onUserProcessAnonymously}>
            Tiếp tục chơi ẩn danh
          </AlertDialogCancel>
          <AlertDialogAction onClick={onUserProcessWithLogin}>
            Đăng nhập
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

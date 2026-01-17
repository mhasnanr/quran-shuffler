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
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface RecallFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahName: string;
  ayahRange: string;
  onRemembered: () => void;
  onForgot: () => void;
}

const RecallFeedbackDialog = ({
  open,
  onOpenChange,
  surahName,
  ayahRange,
  onRemembered,
  onForgot,
}: RecallFeedbackDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            How did it go?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <span className="font-medium text-foreground">{surahName}</span>
            {ayahRange && (
              <span className="text-muted-foreground"> ({ayahRange})</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row items-center justify-center gap-3 mt-4">
          <AlertDialogCancel
            onClick={onForgot}
            data-tour="need-review-button"
            className="m-0 flex-1 flex items-center justify-center border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700"
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            Need Review
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onRemembered}
            data-tour="remembered-button"
            className="m-0 flex-1 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Remembered
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RecallFeedbackDialog;

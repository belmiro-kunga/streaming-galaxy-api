
import React from 'react';
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
import { SubscriptionPlan } from '@/types/api';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planToDelete: SubscriptionPlan | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  planToDelete,
  onConfirm,
  isLoading = false
}) => {
  if (!planToDelete) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!isLoading) {
        onOpenChange(open);
      }
    }}>
      <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Plano</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Você tem certeza que deseja excluir o plano "{planToDelete.nome}"? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            disabled={isLoading}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;

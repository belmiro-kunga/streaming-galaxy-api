
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { SubscriptionPlan } from '@/types/api';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planToDelete: SubscriptionPlan | null;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  planToDelete,
  onConfirm
}) => {
  if (!planToDelete) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription className="text-gray-400">
            Tem certeza que deseja excluir o plano "{planToDelete?.nome}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;

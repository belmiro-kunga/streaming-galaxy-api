
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteProfileDialogProps {
  onDelete: () => void;
  onCancel: () => void;
}

export const DeleteProfileDialog: React.FC<DeleteProfileDialogProps> = ({
  onDelete,
  onCancel
}) => {
  return (
    <DialogContent className="bg-gray-900 text-white border-gray-800">
      <DialogHeader>
        <DialogTitle>Excluir perfil</DialogTitle>
        <DialogDescription className="text-gray-400">
          Tem certeza que deseja excluir o perfil? Esta ação não pode ser desfeita.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-gray-700 hover:bg-gray-800">
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onDelete}>Excluir</Button>
      </DialogFooter>
    </DialogContent>
  );
};

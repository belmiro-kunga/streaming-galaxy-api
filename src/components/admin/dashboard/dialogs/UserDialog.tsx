
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dialogMode: "add" | "edit";
  currentUser: any;
  setCurrentUser: (user: any) => void;
  handleSave: () => void;
}

const UserDialog = ({
  isOpen,
  onOpenChange,
  dialogMode,
  currentUser,
  setCurrentUser,
  handleSave
}: UserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{dialogMode === "add" ? "Adicionar Novo Usuário" : "Editar Usuário"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {dialogMode === "add" 
              ? "Preencha os dados para adicionar um novo usuário ao sistema." 
              : "Atualize as informações do usuário."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Primeiro Nome</Label>
              <Input 
                id="firstName" 
                value={currentUser?.first_name || ""}
                onChange={(e) => setCurrentUser({...currentUser, first_name: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Último Nome</Label>
              <Input 
                id="lastName" 
                value={currentUser?.last_name || ""}
                onChange={(e) => setCurrentUser({...currentUser, last_name: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={currentUser?.email || ""}
              onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              type="tel"
              value={currentUser?.phone || ""}
              onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input 
              id="country" 
              value={currentUser?.country || "Angola"}
              disabled
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="province">Província</Label>
            <Select 
              value={currentUser?.province || ""} 
              onValueChange={(value) => setCurrentUser({...currentUser, province: value})}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Selecione uma província" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {[
                  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
                  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 
                  'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
                  'Namibe', 'Uíge', 'Zaire'
                ].map((prov) => (
                  <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={currentUser?.status || "Ativo"} 
              onValueChange={(value) => setCurrentUser({...currentUser, status: value})}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            disabled={!currentUser?.first_name || !currentUser?.last_name || !currentUser?.email}
            className="bg-primary hover:bg-primary/90"
          >
            {dialogMode === "add" ? "Adicionar" : "Atualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;

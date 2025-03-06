
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Pencil, Trash, BadgeDollarSign } from 'lucide-react';

interface UsersTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUsers: Array<any>;
  addUser: () => void;
  editUser: (user: any) => void;
  deleteUser: (user: any) => void;
  manageSubscription: (user: any) => void;
}

const UsersTab = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredUsers, 
  addUser, 
  editUser, 
  deleteUser, 
  manageSubscription 
}: UsersTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <Button 
          onClick={addUser} 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <UserPlus size={16} />
          <span>Adicionar Usuário</span>
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nome ou email..." 
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Telefone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Província</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assinatura</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data Registro</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium">{user.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.province}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'Ativo' ? 'bg-green-900 text-green-400' : 
                          user.status === 'Pendente' ? 'bg-amber-900 text-amber-400' : 
                          'bg-red-900 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.subscription ? (
                          <span className="text-sm">{user.subscription}</span>
                        ) : (
                          <span className="text-sm text-gray-500">Sem assinatura</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{user.created_at}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => manageSubscription(user)}
                          className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                          title="Gerenciar assinatura"
                        >
                          <BadgeDollarSign size={16} className="text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editUser(user)}
                          className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                          title="Editar usuário"
                        >
                          <Pencil size={16} className="text-blue-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteUser(user)}
                          className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                          title="Excluir usuário"
                        >
                          <Trash size={16} className="text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;

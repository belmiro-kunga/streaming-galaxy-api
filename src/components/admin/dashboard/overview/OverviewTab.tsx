
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import StatsCards from './StatsCards';

interface OverviewTabProps {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    familyPlans: number;
  };
  contentStats: {
    totalContent: number;
    movies: number;
    series: number;
    recent: number;
  };
  pendingPayments: Array<{
    id: string;
    user: string;
    plan: string;
    amount: string;
    date: string;
  }>;
  users: Array<any>;
  approvePayment: (id: string) => void;
  rejectPayment: (id: string) => void;
}

const OverviewTab = ({ 
  userStats, 
  contentStats, 
  pendingPayments, 
  users, 
  approvePayment, 
  rejectPayment 
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Painel de Controle</h2>
      
      <StatsCards 
        userStats={userStats} 
        contentStats={contentStats} 
        pendingPaymentsCount={pendingPayments.length} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Aprovações de Pagamento</CardTitle>
            <CardDescription className="text-gray-400">
              Confirmações pendentes de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium">{payment.user}</h3>
                      <div className="text-sm text-gray-400">
                        {payment.plan} - {payment.amount}
                      </div>
                      <div className="text-xs text-gray-500">{payment.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 bg-green-950 border-green-800 text-green-400 hover:bg-green-900"
                        onClick={() => approvePayment(payment.id)}
                      >
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 bg-red-950 border-red-800 text-red-400 hover:bg-red-900"
                        onClick={() => rejectPayment(payment.id)}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription className="text-gray-400">
              Últimos usuários registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="text-sm text-gray-400">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.created_at}</div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Ativo' ? 'bg-green-900 text-green-400' : 
                        user.status === 'Pendente' ? 'bg-amber-900 text-amber-400' : 
                        'bg-red-900 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;

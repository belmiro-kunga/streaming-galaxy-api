
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Payment } from '@/contexts/admin/types';

interface PaymentsTabProps {
  pendingPayments: Payment[];
  approvePayment: (id: string) => void;
  rejectPayment: (id: string) => void;
}

const PaymentsTab = ({ pendingPayments, approvePayment, rejectPayment }: PaymentsTabProps) => {
  const handleViewProof = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Pagamentos</h2>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Pagamentos Pendentes</CardTitle>
          <CardDescription className="text-gray-400">
            Confirme ou rejeite os pagamentos enviados pelos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {pendingPayments.length > 0 ? (
                pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium">{payment.user}</h3>
                      <div className="text-sm text-gray-400">
                        Plano: {payment.plan}
                      </div>
                      <div className="text-sm text-gray-400">
                        Valor: {payment.amount}
                      </div>
                      <div className="text-xs text-gray-500">Data: {payment.date}</div>
                      <div className="text-xs mt-1 px-2 py-1 rounded-full bg-yellow-900/50 text-yellow-400 inline-block">
                        {payment.status === 'pendente' ? 'Pendente' : payment.status}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600"
                        onClick={() => handleViewProof(payment.payment_proof_url)}
                        disabled={!payment.payment_proof_url}
                      >
                        Ver Comprovante
                      </Button>
                      <Button 
                        variant="outline"
                        className="bg-green-950 border-green-800 text-green-400 hover:bg-green-900"
                        onClick={() => approvePayment(payment.id)}
                      >
                        Aprovar
                      </Button>
                      <Button 
                        variant="outline"
                        className="bg-red-950 border-red-800 text-red-400 hover:bg-red-900"
                        onClick={() => rejectPayment(payment.id)}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  Não há pagamentos pendentes para aprovação
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTab;

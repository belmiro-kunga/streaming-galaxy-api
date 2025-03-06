
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
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
  pendingPaymentsCount: number;
}

const StatsCards = ({ userStats, contentStats, pendingPaymentsCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userStats.totalUsers}</div>
          <p className="text-green-400 text-sm">+12% neste mês</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Usuários Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userStats.premiumUsers}</div>
          <p className="text-green-400 text-sm">{Math.round(userStats.premiumUsers / userStats.totalUsers * 100)}% do total</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Conteúdos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{contentStats.totalContent}</div>
          <p className="text-sm">{contentStats.movies} filmes, {contentStats.series} séries</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pagamentos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{pendingPaymentsCount}</div>
          <p className="text-amber-400 text-sm">Aguardando aprovação</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;

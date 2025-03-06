
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Film, Calendar } from "lucide-react";
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';

const HomeTab = () => {
  const { userStats, contentStats } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-6">Bem-vindo ao Dashboard</h2>
        <p className="text-gray-400 mb-8">
          Gerencie conteúdos, usuários e as operações da plataforma de streaming.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Usuários Ativos
            </CardTitle>
            <Users className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.activeUsers}</div>
            <p className="text-xs text-gray-400 mt-1">
              De {userStats.totalUsers} usuários registrados
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Conteúdos
            </CardTitle>
            <Film className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{contentStats.totalContent}</div>
            <p className="text-xs text-gray-400 mt-1">
              {contentStats.movies} filmes, {contentStats.series} séries
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Planos Premium
            </CardTitle>
            <Activity className="h-5 w-5 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.premiumUsers}</div>
            <p className="text-xs text-gray-400 mt-1">
              Assinaturas premium ativas
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Novos Conteúdos
            </CardTitle>
            <Calendar className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{contentStats.recent}</div>
            <p className="text-xs text-gray-400 mt-1">
              Adicionados nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Conteúdos Mais Assistidos</CardTitle>
            <CardDescription className="text-gray-400">
              Os títulos mais populares na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Filme Popular 1', 'Série Popular 1', 'Filme Popular 2', 'Documentário 1'].map((title, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-200">{title}</p>
                      <p className="text-gray-500 text-sm">{5000 - index * 800} visualizações</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-emerald-400 text-sm mr-2">
                      {index === 0 ? '+12%' : index === 1 ? '+8%' : index === 2 ? '+5%' : '+2%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Atividades Recentes</CardTitle>
            <CardDescription className="text-gray-400">
              Últimas ações na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Novo usuário registrado', user: 'Maria Silva', time: '12 minutos atrás' },
                { action: 'Conteúdo adicionado', user: 'Admin', time: '2 horas atrás' },
                { action: 'Pagamento recebido', user: 'João Almeida', time: '6 horas atrás' },
                { action: 'Relatório gerado', user: 'Suporte', time: '1 dia atrás' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 border-b border-gray-700 pb-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-gray-200">{activity.action}</p>
                    <div className="flex space-x-2 text-sm">
                      <span className="text-indigo-400">{activity.user}</span>
                      <span className="text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeTab;

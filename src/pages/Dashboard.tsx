import React from 'react';
import { Heart, Users, FileText, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  // Mock data - replace with real API calls
  const stats = {
    totalAnimais: 156,
    animaisDisponiveis: 42,
    animaisAdotados: 114,
    adocoesDoMes: 12,
    totalAdotantes: 89,
    termosAtivos: 34,
  };

  const recentAnimals = [
    { id: 1, nome: 'Bella', tipo: 'cao', status: 'disponivel', idade: 2 },
    { id: 2, nome: 'Mimi', tipo: 'gato', status: 'adotado', idade: 1 },
    { id: 3, nome: 'Rex', tipo: 'cao', status: 'em_processo', idade: 3 },
  ];

  const recentAdoptions = [
    { id: 1, animal: 'Luna', adotante: 'Maria Silva', data: '2024-01-10' },
    { id: 2, animal: 'Toby', adotante: 'João Santos', data: '2024-01-08' },
    { id: 3, animal: 'Mel', adotante: 'Ana Costa', data: '2024-01-05' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-success';
      case 'adotado': return 'bg-primary';
      case 'em_processo': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'adotado': return 'Adotado';
      case 'em_processo': return 'Em Processo';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento da ONG
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalAnimais}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.animaisDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando adoção
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adotados</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.animaisAdotados}</div>
            <p className="text-xs text-muted-foreground">
              Total de sucessos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adoções do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.adocoesDoMes}</div>
            <p className="text-xs text-muted-foreground">
              Janeiro 2024
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adotantes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalAdotantes}</div>
            <p className="text-xs text-muted-foreground">
              Cadastros ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.termosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Em processamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Animals */}
        <Card className="bg-gradient-card border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Animais Recentes</span>
            </CardTitle>
            <CardDescription>
              Últimos animais cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnimals.map((animal) => (
                <div key={animal.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{animal.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {animal.tipo === 'cao' ? '🐕 Cão' : '🐱 Gato'} • {animal.idade} anos
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(animal.status)} text-white`}>
                    {getStatusText(animal.status)}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Animais
            </Button>
          </CardContent>
        </Card>

        {/* Recent Adoptions */}
        <Card className="bg-gradient-card border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Adoções Recentes</span>
            </CardTitle>
            <CardDescription>
              Últimas adoções realizadas com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAdoptions.map((adoption) => (
                <div key={adoption.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{adoption.animal}</p>
                      <p className="text-sm text-muted-foreground">
                        Adotado por {adoption.adotante}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {new Date(adoption.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
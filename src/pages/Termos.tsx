import React from 'react';
import { FileText, Plus, Search, Filter, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Termos = () => {
  // Mock data
  const termos = [
    {
      id: 1,
      nome: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      cpf: '111.222.333-44',
      dataNascimento: new Date('1985-05-15'),
      estadoCivil: 'Solteiro',
      profissao: 'Engenheiro',
      animaisVinculados: ['Bella'],
      endereco: {
        cidade: 'São Paulo',
        estado: 'SP'
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: 2,
      nome: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      cpf: '555.666.777-88',
      dataNascimento: new Date('1990-08-22'),
      estadoCivil: 'Casada',
      profissao: 'Professora',
      animaisVinculados: ['Rex', 'Mimi'],
      endereco: {
        cidade: 'Rio de Janeiro',
        estado: 'RJ'
      },
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 3,
      nome: 'Roberto Santos',
      email: 'roberto.santos@email.com',
      cpf: '999.888.777-66',
      dataNascimento: new Date('1978-12-10'),
      estadoCivil: 'Divorciado',
      profissao: 'Médico',
      animaisVinculados: [],
      endereco: {
        cidade: 'Brasília',
        estado: 'DF'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Termos de Compromisso</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie todos os termos de compromisso de adoção
          </p>
        </div>
        <Button className="shadow-glow w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Novo Termo</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF..."
              className="pl-8 bg-background"
            />
          </div>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {termos.map((termo) => (
          <Card key={termo.id} className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-foreground">{termo.nome}</CardTitle>
                <Badge className={termo.animaisVinculados.length > 0 ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                  {termo.animaisVinculados.length > 0 ? 'Ativo' : 'Pendente'}
                </Badge>
              </div>
              <CardDescription>
                Criado em {termo.createdAt.toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Document icon */}
                <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="h-16 w-16 text-white opacity-50" />
                </div>
                
                {/* Personal info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">CPF:</span>
                    <span className="text-foreground">{termo.cpf}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Idade:</span>
                    <span className="text-foreground">{calculateAge(termo.dataNascimento)} anos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estado Civil:</span>
                    <span className="text-foreground">{termo.estadoCivil}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Profissão:</span>
                    <span className="text-foreground">{termo.profissao}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Localização: </span>
                  <span className="text-foreground">
                    {termo.endereco.cidade}, {termo.endereco.estado}
                  </span>
                </div>

                {/* Linked animals */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Animais vinculados ({termo.animaisVinculados.length})
                  </p>
                  {termo.animaisVinculados.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {termo.animaisVinculados.map((animal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {animal}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum animal vinculado</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Ver PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {termos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum termo encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando o primeiro termo de compromisso
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Termo
          </Button>
        </div>
      )}
    </div>
  );
};

export default Termos;
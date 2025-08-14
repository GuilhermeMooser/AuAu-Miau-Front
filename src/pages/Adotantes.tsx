import React from 'react';
import { Users, Plus, Search, Filter, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Adotantes = () => {
  // Mock data
  const adotantes = [
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      status: 'ativo',
      animaisAdotados: ['Bella', 'Rex'],
      endereco: {
        cidade: 'São Paulo',
        estado: 'SP'
      },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      nome: 'João Santos',
      email: 'joao.santos@email.com',
      telefone: '(11) 88888-8888',
      cpf: '987.654.321-00',
      status: 'ativo',
      animaisAdotados: ['Mimi'],
      endereco: {
        cidade: 'Rio de Janeiro',
        estado: 'RJ'
      },
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana.costa@email.com',
      telefone: '(11) 77777-7777',
      cpf: '456.789.123-00',
      status: 'inativo',
      animaisAdotados: [],
      endereco: {
        cidade: 'Belo Horizonte',
        estado: 'MG'
      },
      createdAt: new Date('2024-01-05'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success text-success-foreground';
      case 'inativo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Adotantes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os adotantes cadastrados
          </p>
        </div>
        <Button className="shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Adotante
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, CPF..."
              className="pl-8 bg-background"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Adopters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adotantes.map((adotante) => (
          <Card key={adotante.id} className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-foreground">{adotante.nome}</CardTitle>
                <Badge className={getStatusColor(adotante.status)}>
                  {adotante.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <CardDescription>
                Cadastrado em {adotante.createdAt.toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Profile icon */}
                <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="h-16 w-16 text-white opacity-50" />
                </div>
                
                {/* Contact info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground truncate">{adotante.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{adotante.telefone}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Localização: </span>
                  <span className="text-foreground">
                    {adotante.endereco.cidade}, {adotante.endereco.estado}
                  </span>
                </div>

                {/* Adopted animals */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Animais adotados ({adotante.animaisAdotados.length})
                  </p>
                  {adotante.animaisAdotados.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {adotante.animaisAdotados.map((animal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {animal}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum animal adotado</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {adotantes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum adotante encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece cadastrando o primeiro adotante
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Primeiro Adotante
          </Button>
        </div>
      )}
    </div>
  );
};

export default Adotantes;
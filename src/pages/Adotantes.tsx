import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, Clock, Edit, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdotanteForm from '@/components/forms/AdotanteForm';
import AdotanteFilters from '@/components/forms/AdotanteFilters';
import { Adotante, AdotanteFilters as IAdotanteFilters } from '@/types';

const Adotantes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAdotante, setSelectedAdotante] = useState<Adotante | undefined>();
  const [filters, setFilters] = useState<IAdotanteFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data with updated structure
  const adotantes: Adotante[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      dataNascimento: new Date('1985-03-15'),
      rg: '12.345.678-9',
      cpf: '123.456.789-00',
      contatos: [
        { tipo: 'celular', valor: '(11) 99999-9999', principal: true },
        { tipo: 'email', valor: 'maria.silva@email.com', principal: false }
      ],
      profissao: 'Veterinária',
      estadoCivil: 'casado',
      enderecos: [
        {
          rua: 'Rua das Flores, 123',
          bairro: 'Jardim Paulista',
          numero: '123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          tipo: 'residencial'
        }
      ],
      status: 'ativo',
      animaisAdotados: [],
      proximoContato: new Date('2024-03-15'),
      diasParaContato: 30,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      nome: 'João Santos',
      dataNascimento: new Date('1990-07-22'),
      rg: '98.765.432-1',
      cpf: '987.654.321-00',
      contatos: [
        { tipo: 'celular', valor: '(11) 88888-8888', principal: true },
        { tipo: 'email', valor: 'joao.santos@email.com', principal: false }
      ],
      profissao: 'Engenheiro',
      estadoCivil: 'solteiro',
      enderecos: [
        {
          rua: 'Av. Paulista, 1000',
          bairro: 'Bela Vista',
          numero: '1000',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          tipo: 'residencial'
        }
      ],
      status: 'ativo',
      animaisAdotados: [],
      proximoContato: new Date('2024-03-20'),
      diasParaContato: 15,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      nome: 'Ana Costa',
      dataNascimento: new Date('1988-12-05'),
      rg: '45.678.912-3',
      cpf: '456.789.123-00',
      contatos: [
        { tipo: 'telefone', valor: '(11) 77777-7777', principal: true },
        { tipo: 'email', valor: 'ana.costa@email.com', principal: false }
      ],
      profissao: 'Professora',
      estadoCivil: 'divorciado',
      enderecos: [
        {
          rua: 'Rua da Consolação, 500',
          bairro: 'Consolação',
          numero: '500',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01302-000',
          tipo: 'residencial'
        }
      ],
      status: 'inativo',
      animaisAdotados: [],
      proximoContato: new Date('2024-03-25'),
      diasParaContato: 7,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success text-success-foreground';
      case 'inativo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPrimaryContact = (contatos: any[]) => {
    return contatos.find(c => c.principal) || contatos[0];
  };

  const getPrimaryAddress = (enderecos: any[]) => {
    return enderecos.find(e => e.tipo === 'residencial') || enderecos[0];
  };

  const isContactDue = (proximoContato?: Date) => {
    if (!proximoContato) return false;
    const today = new Date();
    return proximoContato <= today;
  };

  const getDaysUntilContact = (proximoContato?: Date) => {
    if (!proximoContato) return null;
    const today = new Date();
    const diff = Math.ceil((proximoContato.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleCreateAdotante = (data: any) => {
    console.log('Creating adotante:', data);
    setShowCreateModal(false);
  };

  const handleEditAdotante = (data: any) => {
    console.log('Editing adotante:', data);
    setShowEditModal(false);
    setSelectedAdotante(undefined);
  };

  const handleViewAdotante = (adotante: Adotante) => {
    setSelectedAdotante(adotante);
    setShowViewModal(true);
  };

  const handleEditClick = (adotante: Adotante) => {
    setSelectedAdotante(adotante);
    setShowEditModal(true);
  };

  const handleApplyFilters = (newFilters: IAdotanteFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
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
        <Button className="shadow-glow" onClick={() => setShowCreateModal(true)}>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {Object.keys(filters).length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {Object.keys(filters).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <AdotanteFilters
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          activeFilters={filters}
        />
      )}

      {/* Adopters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adotantes.map((adotante) => {
          const primaryContact = getPrimaryContact(adotante.contatos);
          const primaryAddress = getPrimaryAddress(adotante.enderecos);
          const daysUntilContact = getDaysUntilContact(adotante.proximoContato);
          const contactDue = isContactDue(adotante.proximoContato);

          return (
            <Card key={adotante.id} className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground">{adotante.nome}</CardTitle>
                  <div className="flex items-center gap-2">
                    {contactDue && (
                      <Badge variant="destructive" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Contato Vencido
                      </Badge>
                    )}
                    <Badge className={getStatusColor(adotante.status)}>
                      {adotante.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
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
                    {primaryContact?.tipo === 'email' && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground truncate">{primaryContact.valor}</span>
                      </div>
                    )}
                    {(primaryContact?.tipo === 'telefone' || primaryContact?.tipo === 'celular' || primaryContact?.tipo === 'whatsapp') && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{primaryContact.valor}</span>
                      </div>
                    )}
                  </div>

                  {/* Basic info */}
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">CPF: </span>
                      <span className="text-foreground">{adotante.cpf}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profissão: </span>
                      <span className="text-foreground">{adotante.profissao}</span>
                    </div>
                  </div>

                  {/* Location */}
                  {primaryAddress && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Localização: </span>
                      <span className="text-foreground">
                        {primaryAddress.cidade}, {primaryAddress.estado}
                      </span>
                    </div>
                  )}

                  {/* Contact schedule */}
                  {adotante.proximoContato && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Próximo contato: </span>
                      <span className={`text-foreground ${contactDue ? 'text-destructive font-medium' : ''}`}>
                        {adotante.proximoContato.toLocaleDateString('pt-BR')}
                        {daysUntilContact !== null && (
                          <span className="ml-1 text-muted-foreground">
                            ({daysUntilContact > 0 ? `em ${daysUntilContact} dias` : `venceu há ${Math.abs(daysUntilContact)} dias`})
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Adopted animals */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Animais adotados ({adotante.animaisAdotados.length})
                    </p>
                    {adotante.animaisAdotados.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {adotante.animaisAdotados.map((animal, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {animal.nome}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Nenhum animal adotado</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(adotante)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewAdotante(adotante)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {adotantes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum adotante encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece cadastrando o primeiro adotante
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Primeiro Adotante
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Adotante</DialogTitle>
          </DialogHeader>
          <AdotanteForm
            mode="create"
            onSubmit={handleCreateAdotante}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Adotante</DialogTitle>
          </DialogHeader>
          <AdotanteForm
            mode="edit"
            adotante={selectedAdotante}
            onSubmit={handleEditAdotante}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedAdotante(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Adotante</DialogTitle>
          </DialogHeader>
          <AdotanteForm
            mode="view"
            adotante={selectedAdotante}
            onSubmit={() => {}}
            onCancel={() => {
              setShowViewModal(false);
              setSelectedAdotante(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Adotantes;
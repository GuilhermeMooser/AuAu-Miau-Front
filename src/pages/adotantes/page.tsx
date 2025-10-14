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
import { useAdotantes } from './useAdotantes';

const AdotantesPage = () => {
  const {
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showViewModal,
    setShowViewModal,
    showFilters,
    setShowFilters,
    selectedAdotante,
    setSelectedAdotante,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    adotantes,
    handleCreateAdotante,
    handleEditAdotante,
    handleViewAdotante,
    handleEditClick,
    handleApplyFilters,
    handleClearFilters,
    getStatusColor,
    getPrimaryContact,
    getPrimaryAddress,
    isContactDue,
    getDaysUntilContact,
  } = useAdotantes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Adotantes</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie todos os adotantes cadastrados
          </p>
        </div>
        <Button className="shadow-glow w-full sm:w-auto" onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Cadastrar Adotante</span>
          <span className="sm:hidden">Cadastrar</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, CPF..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) {
                  setShowFilters(false);
                  handleClearFilters();
                }
              }}
            />
          </div>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowFilters(!showFilters)}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                    {contactDue && adotante.notificacoesAtivas && (
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
                      <span className={`text-foreground ${contactDue && adotante.notificacoesAtivas ? 'text-destructive font-medium' : ''}`}>
                        {adotante.proximoContato.toLocaleDateString('pt-BR')}
                        {daysUntilContact !== null && (
                          <span className="ml-1 text-muted-foreground">
                            ({daysUntilContact > 0 ? `em ${daysUntilContact} dias` : `venceu há ${Math.abs(daysUntilContact)} dias`})
                          </span>
                        )}
                      </span>
                      {!adotante.notificacoesAtivas && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Notificações Desativadas
                        </Badge>
                      )}
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
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(adotante)}>
                      <Edit className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline ml-1">Editar</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewAdotante(adotante)}>
                      <Eye className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline ml-1">Ver Detalhes</span>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
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

export default AdotantesPage;
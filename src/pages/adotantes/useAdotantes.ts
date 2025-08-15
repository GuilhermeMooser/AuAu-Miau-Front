import { useState } from 'react';
import { Adotante, AdotanteFilters } from '@/types';

export const useAdotantes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAdotante, setSelectedAdotante] = useState<Adotante | undefined>();
  const [filters, setFilters] = useState<AdotanteFilters>({});
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
      animaisVinculados: [],
      proximoContato: new Date('2024-03-15'),
      diasParaContato: 30,
      notificacoesAtivas: true,
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
      animaisVinculados: [],
      proximoContato: new Date('2024-03-20'),
      diasParaContato: 15,
      notificacoesAtivas: false,
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
      animaisVinculados: [],
      proximoContato: new Date('2024-03-25'),
      diasParaContato: 7,
      notificacoesAtivas: true,
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

  const handleApplyFilters = (newFilters: AdotanteFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return {
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
  };
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { toast } from "../../hooks/use-toast";
import {
  Adopter,
  AdopterAddress,
  AdopterContact,
  CreateAdopterDto,
  MinimalAdopter,
} from "../../types";
import { adotanteService } from "../../services/adotanteService";

export const useAdotantes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMinimalAdotante, setSelectedMinimalAdotante] = useState<
    MinimalAdopter | undefined
  >();

  const [selectedAdotante, setSelectedAdotante] = useState<
    Adopter | undefined
  >();

  const [filters, setFilters] = useState<AdotanteFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [adotantes, setAdotantes] = useState<MinimalAdopter[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdotantes = async () => {
    try {
      setLoading(true);
      const response = await adotanteService.list(filters, page, 100);

      const adoptersFormated: MinimalAdopter[] = response.items.map(
        (adotante) => ({
          ...adotante,
          dtToNotify: adotante.dtToNotify ? new Date(adotante.dtToNotify) : undefined,
          audit: {
            ...adotante.audit,
            createdAt: new Date(adotante.audit.createdAt),
            updatedAt: new Date(adotante.audit.updatedAt),
            deletedAt: adotante.audit.deletedAt
              ? new Date(adotante.audit.deletedAt)
              : null,
          },
        })
      );

      const totalPages = response.meta.totalPages;
      setAdotantes(adoptersFormated);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching adotantes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os adotantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdotantes();
  }, [filters, page]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-success text-success-foreground";
      case "inativo":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPrimaryContact = (contatos: AdopterContact[]) => {
    return contatos?.find((c) => c.isPrincipal) || contatos[0];
  };

  const getPrimaryAddress = (enderecos: AdopterAddress[]) => {
    return enderecos[0];
  };

  const isContactDue = (proximoContato?: Date) => {
    if (!proximoContato) return false;
    const today = new Date();
    return proximoContato <= today;
  };

  const getDaysUntilContact = (proximoContato?: Date) => {
    if (!proximoContato) return null;
    const today = new Date();
    const diff = Math.ceil(
      (proximoContato.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const handleCreateAdotante = async (data: CreateAdopterDto) => {
    try {
      setLoading(true);
      await adotanteService.create(data);
      toast({
        title: "Sucesso",
        description: "Adotante criado com sucesso",
      });
      setShowCreateModal(false);
      await fetchAdotantes();
    } catch (error) {
      console.error("Error creating adotante:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o adotante",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdotante = async (data: any) => {
    if (!selectedMinimalAdotante) return;

    try {
      setLoading(true);
      await adotanteService.update(selectedMinimalAdotante.id, data);
      toast({
        title: "Sucesso",
        description: "Adotante atualizado com sucesso",
      });
      setShowEditModal(false);
      setSelectedMinimalAdotante(undefined);
      await fetchAdotantes();
    } catch (error) {
      console.error("Error updating adotante:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o adotante",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdotante = async (id: string) => {
    try {
      setLoading(true);
      await adotanteService.delete(id);
      toast({
        title: "Sucesso",
        description: "Adotante excluído com sucesso",
      });
      await fetchAdotantes();
    } catch (error) {
      console.error("Error deleting adotante:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o adotante",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAdotante = (adotante: Adopter) => {
    setSelectedMinimalAdotante(adotante);
    setShowViewModal(true);
  };

  const handleEditClick = async ({id}: MinimalAdopter) => {
    const selectedAdopter = await adotanteService.getById(id)
    setSelectedAdotante(selectedAdopter);
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
    selectedMinimalAdotante,
    setSelectedMinimalAdotante,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    adotantes,
    loading,
    selectedAdotante,
    setSelectedAdotante,
    page,
    setPage,
    totalPages,
    handleCreateAdotante,
    handleEditAdotante,
    handleDeleteAdotante,
    handleViewAdotante,
    handleEditClick,
    handleApplyFilters,
    handleClearFilters,
    getStatusColor,
    getPrimaryContact,
    getPrimaryAddress,
    isContactDue,
    getDaysUntilContact,
    fetchAdotantes,
  };
};

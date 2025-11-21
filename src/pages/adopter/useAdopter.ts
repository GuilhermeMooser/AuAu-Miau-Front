import { adoptersCache } from "@/constants/cacheNames";
import { useError } from "@/hooks/useError";
import { useModal } from "@/hooks/useMobile";
import { findAdopterById, getAdoptersPaginated } from "@/services/adopter";
import {
  Adopter,
  AdopterFilterFormData,
  AdopterFilters,
  MinimalAdopter,
} from "@/types";
import { mutationErrorHandling } from "@/utils/errorHandling";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

export const useAdopter = () => {
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
    setSelectedAdopter(undefined);
  };

  const {
    isModalOpen: isEditModalOpen,
    handleCloseModal: handleCloseEditModal,
    handleOpenModal: handleOpenEditModal,
  } = useModal();

  const handleCloseEditModalFn = () => {
    handleCloseEditModal();
    setSelectedAdopter(undefined);
  };

  const { errorMessage, clearError, setErrorMessage } = useError();

  /** Filters */
  const [showFilters, setShowFilters] = useState(false);
  const onToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleChangeFilter = (value: string) => {
    setSearchTerm(value);
  };

  const [activeFilters, setActiveFilter] = useState<AdopterFilters>({});
  const filtersCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  const handleApplyFilter = (data: AdopterFilterFormData) => {
    setActiveFilter(data);
    //Fazer Request TODO
  };

  const handleClearFilter = () => {
    setActiveFilter({});
  };

  /** Adopters data */

  const { data: adoptersData, error: errorAdoptersFetch } = useQuery({
    queryKey: [adoptersCache],
    queryFn: async () =>
      (await getAdoptersPaginated(searchTerm, activeFilters)).data,
  });
//TODO USEQUERYERROR
  console.log(adoptersData);

  /** Functions and logics */

  const [selectedAdopter, setSelectedAdopter] = useState<Adopter | undefined>();

  const handleEditClick = (adopter: MinimalAdopter) => {
    getAdopterById(adopter.id);
    handleOpenEditModal();
  };

  const { mutate: getAdopterById } = useMutation({
    mutationFn: async (id: string) => {
      return (await findAdopterById(id)).data;
    },

    onSuccess: (data) => {
      setSelectedAdopter(data);
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao buscar adotante",
        setErrorMessage,
        () => {
          if (
            error instanceof AxiosError &&
            error.response?.data.statusCode === 404
          ) {
            setErrorMessage("Adotante não encontrado");
            return true;
          }
        }
      );
    },
  });

  return {
    isCreateModalOpen,
    searchTerm,
    filtersCount,
    showFilters,
    activeFilters,
    adoptersData,
    selectedAdopter,
    errorMessage,
    isEditModalOpen,
    handleCloseCreateModalFn,
    handleCloseEditModalFn,
    clearError,
    handleOpenCreateModal,
    onToggleFilters,
    handleChangeFilter,
    handleApplyFilter,
    handleClearFilter,
    handleEditClick,
  };
};

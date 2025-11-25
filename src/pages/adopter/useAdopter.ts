import { adoptersCache } from "@/constants/cacheNames";
import { GLOBAL_ERROR_HANDLERS } from "@/constants/errorHandlers";
import { useError } from "@/hooks/useError";
import { useModal } from "@/hooks/useModal";
import { useQueryError } from "@/hooks/useQueryError";
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

type ModalAction = "edit" | "view";

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

  const {
    isModalOpen: isViewModalOpen,
    handleCloseModal: handleCloseViewModal,
    handleOpenModal: handleOpenViewModal,
  } = useModal();

  const [pendingAction, setPendingAction] = useState<ModalAction | null>(null);
  const handleCloseEditModalFn = () => {
    setPendingAction(null);
    handleCloseEditModal();
    setSelectedAdopter(undefined);
  };

  const handleCloseViewModalFn = () => {
    setPendingAction(null);
    handleCloseViewModal();
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

  useQueryError({
    error: errorAdoptersFetch,
    setErrorMessage,
    clearErrorMessage: clearError,
    statusHandlers: [
      ...GLOBAL_ERROR_HANDLERS,
      { statusCode: 401, message: "Acesso não autorizado." },
      { statusCode: 404, message: "Os adotantes não foram encontrados." },
    ],
  });

  /** Functions and logics */

  const [selectedAdopter, setSelectedAdopter] = useState<Adopter | undefined>();

  const handleEditClick = (adopter: MinimalAdopter) => {
    setPendingAction("edit");
    getAdopterById(adopter.id);
  };

  const handleViewClick = (adopter: MinimalAdopter) => {
    setPendingAction("view");
    getAdopterById(adopter.id);
  };

  const { mutate: getAdopterById } = useMutation({
    mutationFn: async (id: string) => {
      return (await findAdopterById(id)).data;
    },

    onSuccess: (data) => {
      setSelectedAdopter(data);
      if (pendingAction === "edit") {
        handleOpenEditModal();
      } else if (pendingAction === "view") {
        handleOpenViewModal();
      }
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
    isViewModalOpen,
    handleViewClick,
    handleCloseViewModalFn,
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

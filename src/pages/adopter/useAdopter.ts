import { useModal } from "@/hooks/useMobile";
import { AdopterFilterFormData, AdopterFilters } from "@/types";
import { useState } from "react";

export const useAdopter = () => {
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
  };

  /**Filters */
  const [showFilters, setShowFilters] = useState(false);
  const onToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleChangeFilter = (value: string) => {
    console.log("FILTER VALUE: ", value);
    setSearchTerm(value);
  };

  const [activeFilters, setActiveFilter] = useState<AdopterFilters>({});
  const filtersCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  const handleApplyFilter = (data: AdopterFilterFormData) => {
    setActiveFilter(data);
    //Fazer Request
  };

  const handleClearFilter = () => {
    setActiveFilter({})
  }

  return {
    isCreateModalOpen,
    searchTerm,
    filtersCount,
    showFilters,
    activeFilters,
    handleOpenCreateModal,
    onToggleFilters,
    handleChangeFilter,
    handleApplyFilter,
    handleClearFilter,
  };
};

import AdopterHeader from "@/components/Adopter/AdopterHeader";
import { useAdopter } from "./useAdopter";
import AdopterFilter from "@/components/Adopter/AdopterFilter";
import AdopterFilterModal from "@/components/Adopter/AdopterFilterModal";

export default function Adopter() {
  const {
    isCreateModalOpen,
    searchTerm,
    filtersCount,
    showFilters,
    activeFilters,
    handleOpenCreateModal,
    onToggleFilters,
    handleChangeFilter,
  } = useAdopter();

  return (
    <div className="space-y-6">
      <AdopterHeader handleOpenCreateModal={handleOpenCreateModal} />
      <AdopterFilter
        searchTerm={searchTerm}
        handleChangeFilter={handleChangeFilter}
        onToggleFilters={onToggleFilters}
        filtersCount={filtersCount}
      />

      <AdopterFilterModal
        isOpen={showFilters}
        activeFilters={activeFilters}
        filtersCount={filtersCount}
      />
    </div>
  );
}

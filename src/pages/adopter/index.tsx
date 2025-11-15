import AdopterHeader from "@/components/Adopter/AdopterHeader";
import { useAdopter } from "./useAdopter";
import AdopterFilter from "@/components/Adopter/AdopterFilter";
import AdopterFilterModal from "@/components/Adopter/AdopterFilterModal";
import AdopterCard from "@/components/Adopter/AdopterCard";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdopterForm from "@/components/Adopter/AdopterForm";

export default function Adopter() {
  const {
    isCreateModalOpen,
    searchTerm,
    filtersCount,
    showFilters,
    activeFilters,
    adoptersData,
    selectedAdopter,
    errorMessage,
    isEditModalOpen,
    clearError,
    handleCloseCreateModalFn,
    handleCloseEditModalFn,
    handleOpenCreateModal,
    onToggleFilters,
    handleChangeFilter,
    handleApplyFilter,
    handleClearFilter,
    handleEditClick,
  } = useAdopter();

  return (
    <>
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
          handleApplyFilter={handleApplyFilter}
          handleClearFilter={handleClearFilter}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {adoptersData?.items?.map((adopter) => {
            return (
              <AdopterCard
                adopter={adopter}
                handleEditClick={handleEditClick}
                handleViewAdotante={() => {}}
              />
            );
          })}
        </div>

        {adoptersData?.items?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum adotante encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando o primeiro adotante
            </p>
            <Button onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Adotante
            </Button>
          </div>
        )}

        {/* Create Modal */}
        <Dialog
          open={isCreateModalOpen}
          onOpenChange={handleCloseCreateModalFn}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Adotante</DialogTitle>
            </DialogHeader>
            <AdopterForm
              mode="create"
              // onSubmit={handleCreateAdotante}
              onSubmit={() => {}}
              onCancel={handleCloseCreateModalFn}
            />
          </DialogContent>
        </Dialog>
        {/* Edit Modal */}
        {/* <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Editar Adotante</DialogTitle>
            </DialogHeader>
            <AdotanteForm
              mode="edit"
              adopter={selectedAdotante}
              onSubmit={handleEditAdotante}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedAdotante(undefined);
              }}
            />
          </DialogContent>
        </Dialog> */}
      </div>

      {/* <Alert
        content={errorMessage}
        isOpen={!!errorMessage}
        onClose={clearError}
      /> */}
    </>
  );
}

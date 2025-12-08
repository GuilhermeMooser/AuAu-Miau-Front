import Header from "@/components/Header";
import { useUsers } from "./useUsers";
import FilterInputSearch from "@/components/FilterInputSearch";
import { InfiniteScrollContainer } from "@/components/InfiteScrollContainer";
import UserCard from "@/components/Users/UserCard";
import { Button } from "@/components/ui/button";
import { Plus, Users as UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Users() {
  const {
    isCreateModalOpen,
    searchTerm,
    hasNextPage,
    isFetchingNextPage,
    usersData,
    handleEditClick,
    handleViewClick,
    fetchNextPage,
    handleChangeFilter,
    handleCloseCreateModalFn,
    handleOpenCreateModal,
  } = useUsers();

  return (
    <>
      <div className="space-y-6">
        <Header
          headerName={"Usuários"}
          handleOpenCreateModal={handleOpenCreateModal}
          headerSubtitle={"Gerencie todos os usuários cadastrados"}
          createEntityName={"Usuário"}
        />

        <FilterInputSearch
          searchTerm={searchTerm}
          handleChangeFilter={handleChangeFilter}
          showFilterButton={false}
        />

        <InfiniteScrollContainer
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          threshold={0}
          loader={
            <div className="col-span-full flex items-center justify-center gap-2 py-8">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-gray-600">
                Carregando mais adotantes...
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {usersData.items.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                handleEditClick={handleEditClick}
                handleViewUser={handleViewClick}
              />
            ))}
          </div>
        </InfiniteScrollContainer>

        {usersData?.items?.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando o primeiro adotante
            </p>
            <Button onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Usuário
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
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            {/* <AdopterForm
              mode="create"
              onCancel={handleCloseCreateModalFn}
              onCreateSuccess={handleCreateSuccess}
            /> */}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

import { GLOBAL_ERROR_HANDLERS } from "@/constants/errorHandlers";
import { useError } from "@/hooks/useError";
import { useModal } from "@/hooks/useModal";
import { useQueryError } from "@/hooks/useQueryError";
import { getUsersPaginated } from "@/services/users";
import { MinimalUser } from "@/types";
import { PaginationUtils } from "@/utils/paginationUtils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useUsers = () => {
  const { errorMessage, clearError, setErrorMessage } = useError();

  /** Create */
  const {
    isModalOpen: isCreateModalOpen,
    handleCloseModal: handleCloseCreateModal,
    handleOpenModal: handleOpenCreateModal,
  } = useModal();

  const handleCloseCreateModalFn = () => {
    handleCloseCreateModal();
    // setSelectedAdopter(undefined);
  };

  /** FilterInputSearch */
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangeFilter = (value: string) => {
    setSearchTerm(value);
  };

  /** Pagination */
  const {
    data,
    error: errorUsersFetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["users", searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const response = getUsersPaginated(
        searchTerm,
        pageParam,
        PaginationUtils.limit
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: true,
    staleTime: 30000,
  });

  const usersData = {
    items: data?.pages.flatMap((page) => page.items) ?? [],
    meta: data?.pages[data.pages.length - 1]?.meta,
  };

  useQueryError({
    error: errorUsersFetch,
    setErrorMessage,
    clearErrorMessage: clearError,
    statusHandlers: [
      ...GLOBAL_ERROR_HANDLERS,
      { statusCode: 401, message: "Acesso não autorizado." },
      { statusCode: 404, message: "Os usuários não foram encontrados." },
    ],
  });

  /** Functions and Logic */
  const handleEditClick = (user: MinimalUser) => {
    // setPendingAction("edit");
    // getAdopterById(adopter.id);
  };

  const handleViewClick = (adopter: MinimalUser) => {
    // setPendingAction("view");
    // getAdopterById(adopter.id);
  };

  return {
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
  };
};

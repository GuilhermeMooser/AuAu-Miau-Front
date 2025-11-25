import { useCallback, useState } from 'react';

export const useModal = () => {
  const [isModalOpen, setisModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setisModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setisModalOpen(false);
  }, []);

  return {
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};

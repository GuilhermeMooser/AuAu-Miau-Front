import { useState } from 'react';

export const useError = () => {
  const [errorMessage, setError] = useState<string | null>(null);

  const setErrorMessage = (message: string) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    errorMessage,
    clearError,
    setErrorMessage,
  };
};

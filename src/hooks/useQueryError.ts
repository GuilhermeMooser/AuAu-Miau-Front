import { isAxiosError } from 'axios';
import { useEffect, useRef } from 'react';

export type ErrorStatusHandler = {
  statusCode: number;
  message: string;
  onError?: () => void;
};

export type ErrorHandlingConfig = {
  error: unknown | null;
  setErrorMessage: (message: string) => void;
  clearErrorMessage: () => void;
  defaultMessage?: string;
  statusHandlers?: ErrorStatusHandler[];
  onUnhandledError?: (error: unknown) => void;
};

export const useQueryError = ({
  error,
  setErrorMessage,
  clearErrorMessage,
  defaultMessage = 'Houve um erro ao buscar as informações',
  statusHandlers = [],
  onUnhandledError,
}: ErrorHandlingConfig) => {
  const handledErrorRef = useRef<unknown>(null);

  useEffect(() => {
    if (!error) {
      handledErrorRef.current = null;
      return;
    }

    if (handledErrorRef.current === error) {
      return;
    }

    handledErrorRef.current = error;

    if (!isAxiosError(error)) {
      setErrorMessage(defaultMessage);
      onUnhandledError?.(error);
      return;
    }

    const statusCode = error.response?.status;
    const handler = statusHandlers.find((h) => h.statusCode === statusCode);

    if (handler) {
      setErrorMessage(handler.message);
      handler.onError?.();
      return;
    }

    const serverMessage = error.response?.data?.message;
    const finalMessage = serverMessage
      ? `${defaultMessage}. ${serverMessage}`
      : defaultMessage;

    setErrorMessage(finalMessage);
    onUnhandledError?.(error);
  }, [error, setErrorMessage, defaultMessage, statusHandlers, onUnhandledError]);

  const resetErrorHandling = () => {
    handledErrorRef.current = null;
    clearErrorMessage();
  };

  return { resetErrorHandling };
};
import { isAxiosError } from "axios";

export const mutationErrorHandling = (
  error: unknown,
  defaultMessage: string,
  setErrorMessage: (message: string) => void,
  handling?: () => boolean | void,
) => {
  if (isAxiosError(error)) {
    if (handling && handling()) {
      return;
    }

    const errorMessage = error.response?.data.message ?? 'Erro no servidor';

    setErrorMessage(`${defaultMessage}. ${errorMessage}`);
    return;
  }

  setErrorMessage(defaultMessage);
};

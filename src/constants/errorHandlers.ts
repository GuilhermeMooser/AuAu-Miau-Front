import { ErrorStatusHandler } from "@/hooks/useQueryError";

export const GLOBAL_ERROR_HANDLERS: ErrorStatusHandler[] = [
  {
    statusCode: 403,
    message: "Recurso exige autorização",
  },
  {
    statusCode: 429,
    message: "Muitas requisições. Aguarde alguns segundos.",
  },
  {
    statusCode: 500,
    message: "Erro no servidor. Tente novamente mais tarde.",
  },
];

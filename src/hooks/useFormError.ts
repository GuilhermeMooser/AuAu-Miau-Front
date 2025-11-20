import { FieldError, FieldErrors } from "react-hook-form";
import { toast } from "./use-toast";

export const useFormError = <T extends Record<string, unknown>>() => {
  const onError = (errors: FieldErrors<T>) => {
    const getFirstError = (
      obj: FieldErrors | FieldError
    ): string | undefined => {
      for (const key in obj) {
        const value = obj[key as keyof typeof obj];
        
        if (typeof value === "string") return value;
        
        if (value && typeof value === "object" && "message" in value && typeof value.message === "string") {
          return value.message;
        }
        
        if (value && typeof value === "object") {
          const nested = getFirstError(value as FieldErrors | FieldError);
          if (nested) return nested;
        }
      }
    };

    toast({
      title: "Verifique os campos",
      description: getFirstError(errors) || "Preencha os campos obrigatórios.",
      variant: "destructive",
    });
  };

  return { onError };
};
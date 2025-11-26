import { cityCache, stateUfCache } from "@/constants/cacheNames";
import { GLOBAL_ERROR_HANDLERS } from "@/constants/errorHandlers";
import { useError } from "@/hooks/useError";
import { useQueryError } from "@/hooks/useQueryError";
import { locationService } from "@/services/locationService";
import { AdopterFilterFormData, AdopterFilters } from "@/types";
import { adopterFiltersSchema } from "@/validations/Adopter/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  activeFilters: AdopterFilters;
};

export const useAdopterFilterModal = ({ activeFilters }: Props) => {
  const { setErrorMessage, clearError, errorMessage } = useError();

  const form = useForm<AdopterFilterFormData>({
    resolver: zodResolver(adopterFiltersSchema),
    defaultValues: {
      city: activeFilters.city || "",
      stateUf: activeFilters.stateUf || "",
      createdAt: activeFilters.createdAt,
      dtToNotify: activeFilters.dtToNotify,
    },
  });

  const selectedState = form.watch("stateUf");

  const { data: statesData, error: errorStatesFetch } = useQuery({
    queryKey: [stateUfCache],
    queryFn: async () => await locationService.getUFs(),
  });

  useQueryError({
    error: errorStatesFetch,
    setErrorMessage,
    clearErrorMessage: clearError,
    statusHandlers: [
      ...GLOBAL_ERROR_HANDLERS,
      { statusCode: 401, message: "Acesso não autorizado." },
      { statusCode: 404, message: "Os estados não foram encontrados." },
    ],
  });

  const {
    data: citiesData,
    error: errorCitiesFetch,
    isLoading: isLoadingCities,
  } = useQuery({
    queryKey: [`${cityCache}-${selectedState}`],
    queryFn: async () => {
      if (!selectedState) return [];
      const ufId = parseInt(selectedState);
      return await locationService.getCitiesByUF(ufId);
    },
  });

  useQueryError({
    error: errorCitiesFetch,
    setErrorMessage,
    clearErrorMessage: clearError,
    statusHandlers: [
      ...GLOBAL_ERROR_HANDLERS,
      { statusCode: 401, message: "Acesso não autorizado." },
      { statusCode: 404, message: "Os estados não foram encontrados." },
    ],
  });

  useEffect(() => {
    form.setValue("city", "");
  }, [selectedState, form]);

  const handleClear = () => {
    form.reset({
      city: "",
      stateUf: "",
      createdAt: null,
      dtToNotify: null,
    });
  };

  return {
    form,
    isLoadingCities,
    selectedState,
    statesData,
    citiesData,
    errorMessage,
    clearError,
    handleClear,
  };
};

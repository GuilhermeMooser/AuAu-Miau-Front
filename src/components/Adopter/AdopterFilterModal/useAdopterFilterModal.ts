import { cityCache, stateUfCache } from "@/constants/cacheNames";
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
  const form = useForm<AdopterFilterFormData>({
    resolver: zodResolver(adopterFiltersSchema),
    defaultValues: {
      status: activeFilters.status,
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

  useEffect(() => {
    form.setValue("city", "");
  }, [selectedState, form]);

  //TODO userQueryError

  const handleClear = () => {
    form.reset({
      status: "",
      city: "",
      stateUf: "",
      createdAt: undefined,
      dtToNotify: undefined,
    });
  };

  return {
    form,
    isLoadingCities,
    selectedState,
    statesData,
    citiesData,
    handleClear,
  };
};

import { AdopterFormData } from "@/types";
import { adopterSchema } from "@/validations/Adopter/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { AdopterFormProps } from ".";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cityCache, stateUfCache } from "@/constants/cacheNames";
import { locationService } from "@/services/locationService";

type Props = {
  adopter: AdopterFormProps["adopter"]
  mode: AdopterFormProps["mode"];
  onCancel:  AdopterFormProps["onCancel"];
};

export const useAdopterForm = ({ adopter, mode, onCancel }: Props) => {
  /** Form */ //TODO COLOCAR OS COLEASNCE PRO EDIT adopter.bla || ""
  const form = useForm<AdopterFormData>({
    resolver: zodResolver(adopterSchema),
    defaultValues: {
      name: "",
      email: "",
      dtOfBirth: undefined,
      rg: "",
      cpf: "",
      activeNotification: undefined,
      addresses: [],
      contacts: [],
    },
  });

  const activeNotificationWatcher = form.watch("activeNotification");
  const isReadOnly = mode === "view";

  /** ========== CONTACTS ========== */
  const {
    fields: contatosFields,
    append: appendContato,
    remove: removeContato,
  } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  useEffect(() => {
    const contacts = form.getValues("contacts");
    if (contacts?.length > 0 && !contacts.some((c) => c.isPrincipal)) {
      form.setValue("contacts.0.isPrincipal", true);
    }
  }, [contatosFields.length]);

  const getContactMask = (index: number) => {
    const type = form.watch(`contacts.${index}.type`);
    if (type === "telefone" || type === "celular" || type === "whatsapp") {
      return "(99) 99999-9999";
    }
    return "";
  };

  const principalCount = form
    .watch("contacts")
    ?.filter((c) => c.isPrincipal).length;

  const handlePrincipalChange = (index: number, newValue: boolean) => {
    const contacts = form.getValues("contacts");
    if (newValue && principalCount > 0) {
      const updated = contacts.map((c, i) => ({
        ...c,
        isPrincipal: i === index,
      }));
      form.setValue("contacts", updated);
      return;
    }
    form.setValue(`contacts.${index}.isPrincipal`, newValue);
  };

  const canSetPrincipal = (index: number) => {
    const current = form.watch(`contacts.${index}.isPrincipal`);
    return current || principalCount === 0;
  };

  /** ========== ADDRESSES ========== */
  const {
    fields: enderecosFields,
    append: appendEndereco,
    remove: removeEndereco,
  } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const { data: statesData = [], isLoading: isLoadingStates } = useQuery({
    queryKey: [stateUfCache],
    queryFn: () => locationService.getUFs(),
  });

  const prState = statesData.find((uf) => uf.acronym === "PR");
  const prUfId = prState?.id;

  const selectedStateId = form.watch("addresses.0.city.stateUf.id") || prUfId;

  const { data: citiesData = [], isLoading: isLoadingCities } = useQuery({
    queryKey: [cityCache, selectedStateId],
    queryFn: () => locationService.getCitiesByUF(selectedStateId!),
    enabled: !!selectedStateId,
  });

  const getCurrentStateUfId = (index: number) => {
    return form.watch(`addresses.${index}.city.stateUf.id`) || 0;
  };

  const getCurrentCityId = (index: number) => {
    return form.watch(`addresses.${index}.city.id`) || 0;
  };

  const handleStateChange = (index: number, value: string) => {
    const selectedUF = statesData.find((uf) => uf.id === Number(value));
    if (!selectedUF) return;

    form.setValue(`addresses.${index}.city.stateUf`, selectedUF);
    /**Clear Cities */
    form.setValue(`addresses.${index}.city.id`, 0);
    form.setValue(`addresses.${index}.city.name`, "");
  };

  const handleCityChange = (index: number, value: string) => {
    const selectedCity = citiesData.find((c) => c.id === Number(value));
    if (selectedCity) {
      form.setValue(`addresses.${index}.city`, selectedCity, {
        shouldValidate: true,
      });
    }
  };

  const loadingLocations = isLoadingStates || isLoadingCities;

  /**Actions */
  const [submitting, setSubmitting] = useState<boolean>(false)
  const handleButtonConfirm = (data: AdopterFormData) => {
    console.log(data)
    setSubmitting(true)
  };

  const handleCloseModal = () => {
    console.log('awdawdawd')
    onCancel()
    form.reset()
  }

  return {
    form,
    isReadOnly,
    activeNotificationWatcher,
    contatosFields,
    submitting,
    enderecosFields,
    statesData,
    citiesData,
    loadingLocations,
    isLoadingStates,
    isLoadingCities,
    prUfId,
    prState,
    appendContato,
    removeContato,
    getContactMask,
    handlePrincipalChange,
    canSetPrincipal,
    appendEndereco,
    removeEndereco,
    handleStateChange,
    handleCityChange,
    getCurrentStateUfId,
    getCurrentCityId,
    handleButtonConfirm,
    handleCloseModal,
  };
};

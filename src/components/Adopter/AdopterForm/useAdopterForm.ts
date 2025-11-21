import { AdopterFormData, CreateAdopterDto } from "@/types";
import { adopterSchema } from "@/validations/Adopter/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldError,
  FieldErrors,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { AdopterFormProps } from ".";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adoptersCache, cityCache, stateUfCache } from "@/constants/cacheNames";
import { locationService } from "@/services/locationService";
import { toast } from "@/hooks/use-toast";
import { useFormError } from "@/hooks/useFormError";
import { createAdopter } from "@/services/adopter";
import { useQueryCache } from "@/hooks/useQueryCache";

type Props = {
  adopter: AdopterFormProps["adopter"];
  mode: AdopterFormProps["mode"];
  onCancel: AdopterFormProps["onCancel"];
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
      activeNotification: false,
      profession: "",
      civilState: undefined,
      dtToNotify: null,
      addresses: [],
      contacts: [],
    },
  });

  const { onError } = useFormError<AdopterFormData>();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contatosFields.length]);

  useEffect(() => {
    if (mode === "create" && contatosFields.length === 0) {
      appendContato({
        type: "celular",
        value: "",
        isPrincipal: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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

  useEffect(() => {
    if (mode === "create" && prState && enderecosFields.length === 0) {
      appendEndereco(
        {
          street: "",
          neighborhood: "",
          number: undefined,
          city: {
            id: 0,
            name: "",
            stateUf: {
              id: prState.id,
              name: prState.name,
              acronym: prState.acronym,
            },
          },
        },
        { shouldFocus: false }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prState, mode]);

  const selectedStateId = form.watch("addresses.0.city.stateUf.id") || prUfId;

  const { data: citiesData = [], isLoading: isLoadingCities } = useQuery({
    queryKey: [`${cityCache}-${selectedStateId}`],
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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const handleButtonConfirm = (data: AdopterFormData) => {
    if (data.activeNotification && !data.dtToNotify) {
      verifyNotificationConfig(data);
      return;
    }

    if (mode === "create") {
      createAdopterMutation(data);
    }
    // else if (mode === 'edit') {

    // } else {
    //   //mode === 'view'
    // }

    console.log(data);
    setSubmitting(true);
  };

  const handleCloseModal = () => {
    onCancel();
    form.reset();
  };

  /**Query Cache */
  const { addItemOnScreen } = useQueryCache();

  /**Mutations */
  const { mutate: createAdopterMutation } = useMutation({
    mutationFn: async (createAdopterDto: CreateAdopterDto) => {
      return (await createAdopter(createAdopterDto)).data;
    },

    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Adotante criado com sucesso",
        variant: "success",
      });
      addItemOnScreen([adoptersCache], data);
      handleCloseModal();
    },
    // onError: (error) => {
    //   mutationErrorHandling(
    //     error,
    //     "Falha ao buscar adotante",
    //     setErrorMessage,
    //     () => {
    //       if (
    //         error instanceof AxiosError &&
    //         error.response?.data.statusCode === 404
    //       ) {
    //         setErrorMessage("Adotante não encontrado");
    //         return true;
    //       }
    //     }
    //   );
    // },
  });

  /**Technical Adjustment */
  const verifyNotificationConfig = (data: AdopterFormData) => {
    if (data.activeNotification && !data.dtToNotify) {
      form.setError("dtToNotify", {
        type: "manual",
        message:
          "Data de notificação é obrigatória quando notificações estão ativas",
      });

      toast({
        title: "Verifique os campos",
        description:
          "Data de notificação é obrigatória quando notificações estão ativas",
        variant: "destructive",
      });
      document.getElementById("dtToNotify")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

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
    onError,
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

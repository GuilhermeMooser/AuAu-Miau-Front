import { AdopterFormData } from "@/types";
import { adopterSchema } from "@/validations/Adopter/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { AdopterFormProps } from ".";
import { useEffect } from "react";

type Props = {
  mode: AdopterFormProps["mode"];
};

export const useAdopterForm = ({ mode }: Props) => {
  /** Form */
  const form = useForm<AdopterFormData>({
    resolver: zodResolver(adopterSchema),
    defaultValues: {
      name: "",
      email: "",
      dtOfBirth: undefined,
      rg: "",
      cpf: "",
      activeNotification: undefined,
    },
  });

  const activeNotificationWatcher = form.watch("activeNotification");

  const isReadOnly = mode === "view";

  /** Helpers Contacts */
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

  /** Helpers Address */

  const {
    fields: enderecosFields,
    append: appendEndereco,
    remove: removeEndereco,
  } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const getCurrentStateUfId = (index: number) => {
    const currentStateId =
      form.watch(`addresses.${index}.city.stateUf.id`) || 0;
    return currentStateId;
  };

  const getCurrentCityId = (index: number) => {
    const currentCityId = form.watch(`addresses.${index}.city.id`) || 0;
    return currentCityId;
  };

  return {
    contatosFields,
    form,
    isReadOnly,
    activeNotificationWatcher,
    enderecosFields,
    getCurrentCityId,
    getCurrentStateUfId,
    appendEndereco,
    removeEndereco,
    removeContato,
    appendContato,
    getContactMask,
    handlePrincipalChange,
    canSetPrincipal,
  };
};

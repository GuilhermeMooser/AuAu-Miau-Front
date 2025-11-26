import { AdopterCardProps } from ".";
import { useMemo } from "react";

type Props = {
  adopter: AdopterCardProps["adopter"];
};

export const useAdopterCard = ({ adopter }: Props) => {
  const primaryContact = useMemo(() => {
    return adopter.contacts?.find(c => c.isPrincipal) ?? adopter.contacts?.[0] ?? null;
  }, [adopter.contacts]);

  const contactType = primaryContact?.type;
  const contactValue = primaryContact?.value ?? null;

  const isPhoneContact =
    contactType === "telefone" ||
    contactType === "celular" ||
    contactType === "whatsapp";

  const daysUntilContact = useMemo(() => {
    if (!adopter.dtToNotify) return null;
    const notifyDate = new Date(adopter.dtToNotify);
    const today = new Date();
    return Math.ceil(
      (notifyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [adopter.dtToNotify]);

  const isContactDue = adopter.dtToNotify
    ? adopter.dtToNotify <= new Date()
    : false;

  return {
    primaryContact,
    contactValue,
    isPhoneContact,
    isContactDue,
    daysUntilContact,
  };
};

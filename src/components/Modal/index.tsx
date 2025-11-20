import { ReactNode } from "react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  width?: string | number;
  cancelIcon?: boolean;
  contentStyle?: string; // estilos extras no conteúdo
}

export default function Modal({
  isOpen,
  onClose,
  children,
  width = "auto",
  contentStyle = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      {/* Conteúdo */}
      <div
        className={clsx(
          "relative rounded-2xl shadow-lg",
          contentStyle
        )}
        style={{ width }}
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        {children}
      </div>
    </div>
  );
}

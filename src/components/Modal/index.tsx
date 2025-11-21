import { ReactNode } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";

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

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className={clsx(
          "relative rounded-2xl shadow-lg pointer-events-auto",
          contentStyle
        )}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

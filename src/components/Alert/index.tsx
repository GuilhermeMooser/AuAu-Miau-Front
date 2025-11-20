import { ReactNode } from "react";
import Icon from "../Icon";
import Modal from "../Modal";

interface AlertProps {
  isOpen: boolean;
  content: ReactNode;
  icon?: ReactNode | "none";
  onClose: () => void;
  className?: string;
  width?: string | number;
}

export default function Alert({
  content,
  icon = (
    <Icon name="CircleAlert" className="text-zinc-500" fontSize="large" />
  ),
  isOpen,
  className = "",
  onClose,
  width = 380,
}: AlertProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      contentStyle={`rounded-md p-0 bg-background border-2 border-white/10 ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center gap-4 p-8">
          {icon !== "none" && icon}
          <span className="text-xs text-zinc-500 sm:text-lg">{content}</span>
        </div>

        <hr />

        <div className="p-4 pr-8 text-right text-primary">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </Modal>
  );
}

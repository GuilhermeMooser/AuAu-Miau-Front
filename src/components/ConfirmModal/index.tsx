import { ReactNode } from "react";
import Modal from "../Modal";
import Icon from "../Icon";

type ConfirmModalProps = {
  isOpen: boolean;
  content: ReactNode;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
  onNotConfirm: VoidFunction;
  className?: string;
};

export default function ConfirmModal({
  isOpen,
  content,
  className,
  onConfirm,
  onClose,
  onNotConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={380}
      contentStyle={`rounded-md z-[200] p-0 bg-background border-2 border-white/10 ${className}`}
    >
      <div className="w-full">
        <div className="flex flex-col items-center gap-4 p-8">
          <Icon name="Info" />
          <span className="text-xs text-white sm:text-lg">{content}</span>
        </div>
        <hr />
        <div className="px-5 py-2 text-primary flex gap-2 justify-end">
          <button
            onClick={onNotConfirm}
            className="border-2 p-2 rounded-xl hover:bg-zinc-800 transition w-full"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="border-2 p-2 rounded-xl hover:bg-zinc-800 transition w-full"
          >
            Sim
          </button>
        </div>
      </div>
    </Modal>
  );
}

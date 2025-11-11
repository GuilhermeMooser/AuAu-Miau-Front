import { Plus } from "lucide-react";
import { Button } from "../../ui/button";

type AdopterHeaderProps = {
  handleOpenCreateModal: VoidFunction;
};

export default function AdopterHeader({
  handleOpenCreateModal,
}: AdopterHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Adotantes
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gerencie todos os adotantes cadastrados
        </p>
      </div>
      <Button
        className="shadow-glow w-full sm:w-auto"
        onClick={handleOpenCreateModal}
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Cadastrar Adotante</span>
        <span className="sm:hidden">Cadastrar</span>
      </Button>
    </div>
  );
}

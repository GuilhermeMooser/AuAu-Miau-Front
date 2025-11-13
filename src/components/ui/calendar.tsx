import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        // Estrutura geral
        months: "flex flex-col space-y-4",
        month: "space-y-3",

        // Cabeçalho (mês e ano + botões laterais)
        caption: "flex items-center justify-center relative",
        caption_label: "hidden",

        caption_dropdowns:
          "flex items-center justify-center gap-2 rounded-md bg-muted/40 px-8 py-1",
        dropdown:
          "border border-input bg-background rounded-md px-1 py-1 text-sm font-medium text-foreground cursor-pointer hover:bg-primary hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors",

        // Botões de navegação – lado a lado, alinhados verticalmente ao centro
        nav: "absolute inset-0 flex items-center justify-between px-1 pointer-events-none",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "pointer-events-auto h-7 w-7 p-0 opacity-80 hover:opacity-100 transition-opacity"
        ),
        nav_button_previous: "",
        nav_button_next: "",

        // Tabela de dias
        table: "w-full border-collapse mt-2",
        head_row: "flex justify-between",
        head_cell:
          "text-muted-foreground text-xs font-medium w-9 text-center rounded-md",
        row: "flex justify-between mt-1",
        cell: "relative h-9 w-9 p-0 text-center text-sm",

        // Estilos dos dias
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 rounded-md font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today:
          "border border-primary text-primary font-semibold bg-background",
        day_outside: "text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Filter, Search, X } from "lucide-react";
import { useAdopterFilterModal } from "./useAdopterFilterModal";
import { AdopterFilterFormData, AdopterFilters } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import Alert from "@/components/Alert";

type AdopterFilterModalProps = {
  isOpen: boolean;
  activeFilters: AdopterFilters;
  handleApplyFilter: (data: AdopterFilterFormData) => void;
  handleClearFilter: () => void;
  filtersCount?: number;
};

export default function AdopterFilterModal({
  isOpen,
  activeFilters,
  handleApplyFilter,
  handleClearFilter,
  filtersCount = 0,
}: AdopterFilterModalProps) {
  const {
    form,
    statesData,
    citiesData,
    isLoadingCities,
    selectedState,
    errorMessage,
    clearError,
    handleClear,
  } = useAdopterFilterModal({
    activeFilters,
  });

  return (
    <>
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
              {filtersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filtersCount} ativo
                  {filtersCount > 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stateUf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statesData?.map((uf) => (
                            <SelectItem key={uf.id} value={`${uf.id}`}>
                              {uf.acronym} - {uf.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedState || isLoadingCities}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedState
                                  ? "Selecione um estado primeiro"
                                  : isLoadingCities
                                  ? "Carregando..."
                                  : "Selecione a cidade"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {citiesData?.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Cadastro (Início)</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="Selecione a data"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dtToNotify"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Próximo Contato</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="Selecione a data"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-x-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleClear();
                      handleClearFilter();
                    }}
                  >
                    <X className="h-4 w-4" />
                    Limpar Filtros
                  </Button>
                  <Button onClick={form.handleSubmit(handleApplyFilter)}>
                    <Search className="h-4 w-4" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}
      <Alert
        isOpen={!!errorMessage}
        content={errorMessage}
        onClose={clearError}
      />
    </>
  );
}

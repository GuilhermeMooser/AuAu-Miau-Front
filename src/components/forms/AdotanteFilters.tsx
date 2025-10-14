import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, Calendar, MapPin, Briefcase, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AdotanteFilters } from '@/types';
import { locationService, UF, City } from '@/services/locationService';

const filtersSchema = z.object({
  nome: z.string().optional(),
  cpf: z.string().optional(),
  status: z.enum(['ativo', 'inativo']).optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  dataInicio: z.string().optional(),
  proximoContato: z.string().optional(),
});

type FiltersFormData = z.infer<typeof filtersSchema>;

interface AdotanteFiltersProps {
  onApplyFilters: (filters: AdotanteFilters) => void;
  onClearFilters: () => void;
  activeFilters: AdotanteFilters;
}

const AdotanteFiltersComponent: React.FC<AdotanteFiltersProps> = ({
  onApplyFilters,
  onClearFilters,
  activeFilters,
}) => {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const form = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      nome: activeFilters.nome || '',
      cpf: activeFilters.cpf || '',
      status: activeFilters.status,
      cidade: activeFilters.cidade || '',
      estado: activeFilters.estado || '',
      dataInicio: activeFilters.dataInicio?.toISOString().split('T')[0] || '',
      proximoContato: activeFilters.proximoContato?.toISOString().split('T')[0] || '',
    },
  });

  const selectedEstado = form.watch('estado');

  useEffect(() => {
    const loadUFs = async () => {
      try {
        const data = await locationService.getUFs();
        setUfs(data);
      } catch (error) {
        console.error('Error loading UFs:', error);
      }
    };
    loadUFs();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedEstado) {
        setCities([]);
        form.setValue('cidade', '');
        return;
      }

      setLoadingCities(true);
      try {
        const ufId = parseInt(selectedEstado);
        const data = await locationService.getCitiesByUF(ufId);
        setCities(data);
      } catch (error) {
        console.error('Error loading cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedEstado, form]);

  const handleSubmit = (data: FiltersFormData) => {
    const filters: AdotanteFilters = {
      ...data,
      dataInicio: data.dataInicio ? new Date(data.dataInicio) : undefined,
      proximoContato: data.proximoContato ? new Date(data.proximoContato) : undefined,
    };
    
    // Remove empty values
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof AdotanteFilters];
      if (value === '' || value === undefined) {
        delete filters[key as keyof AdotanteFilters];
      }
    });
    
    onApplyFilters(filters);
  };

  const handleClear = () => {
    form.reset({
      nome: '',
      cpf: '',
      status: undefined,
      cidade: '',
      estado: '',
      dataInicio: '',
      proximoContato: '',
    });
    setCities([]);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(value => value !== undefined && value !== '').length;
  };

  const getFilterLabel = (key: string, value: any) => {
    const labels: Record<string, Record<string, string>> = {
      status: {
        ativo: 'Ativo',
        inativo: 'Inativo',
      },
    };

    if (key === 'estado') {
      const uf = ufs.find(u => u.id.toString() === value);
      return uf ? uf.acronym : value;
    }

    if (key === 'cidade') {
      const city = cities.find(c => c.id.toString() === value);
      return city ? city.name : value;
    }

    if (labels[key] && labels[key][value]) {
      return labels[key][value];
    }
    
    return value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Busca
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()} ativo{getActiveFiltersCount() > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Buscar por nome..." />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="000.000.000-00" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ufs.map((uf) => (
                          <SelectItem key={uf.id} value={uf.id.toString()}>
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
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedEstado || loadingCities}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedEstado 
                              ? "Selecione um estado primeiro" 
                              : loadingCities 
                              ? "Carregando..." 
                              : "Selecione a cidade"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Cadastro (Início)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proximoContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Contato</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleClear}>
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>
          </form>
        </Form>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || value === '') return null;
                
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {getFilterLabel(key, value)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        delete newFilters[key as keyof AdotanteFilters];
                        onApplyFilters(newFilters);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdotanteFiltersComponent;
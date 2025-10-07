import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Plus, Trash2, User, Phone, MapPin, Calendar, CalendarIcon, Briefcase, Heart, Bell, BellOff, Link, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MaskedInput } from '@/components/ui/masked-input';
import { cn } from '@/lib/utils';
import { Adotante, Contato, Endereco, Animal } from '@/types';
import { locationService, City, UF } from '@/services/locationService';

const contatoSchema = z.object({
  tipo: z.enum(['telefone', 'celular', 'email', 'whatsapp']),
  valor: z.string().min(1, 'Contato é obrigatório'),
  principal: z.boolean(),
});

const enderecoSchema = z.object({
  rua: z.string().min(1, 'Rua é obrigatória'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  cidadeId: z.number().min(1, 'Cidade é obrigatória'),
  estadoId: z.number().min(1, 'Estado é obrigatório'),
  cep: z.string().min(8, 'CEP inválido'),
  city: z.object({
    id: z.number(),
    name: z.string(),
    uf: z.object({
      id: z.number(),
      name: z.string(),
      acronym: z.string(),
      country: z.string(),
    }),
    ibge: z.number(),
  }),
});

const adotanteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  rg: z.string().min(1, 'RG é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  contatos: z.array(contatoSchema).min(1, 'Pelo menos um contato é obrigatório')
    .refine((contatos) => contatos.filter(c => c.principal).length <= 1, {
      message: 'Apenas um contato pode ser principal',
    }),
  profissao: z.string().min(1, 'Profissão é obrigatória'),
  estadoCivil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel']),
  enderecos: z.array(enderecoSchema).min(1, 'Pelo menos um endereço é obrigatório'),
  diasParaContato: z.number().min(1, 'Dias para contato deve ser maior que 0').optional(),
  proximoContato: z.date().optional(),
  notificacoesAtivas: z.boolean(),
  animaisVinculados: z.array(z.string()).optional(),
});

type AdotanteFormData = z.infer<typeof adotanteSchema>;

interface AdotanteFormProps {
  adotante?: Adotante;
  onSubmit: (data: AdotanteFormData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

const AdotanteForm: React.FC<AdotanteFormProps> = ({ adotante, onSubmit, onCancel, mode }) => {
  // Mock data for animals
  const [availableAnimais] = useState<Animal[]>([
    { id: '1', nome: 'Bella', tipo: 'cao', raca: 'Labrador', idade: 2, sexo: 'femea', status: 'disponivel', castrado: true, vacinado: true, vermifugado: true, fotos: [], observacoes: '', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', nome: 'Rex', tipo: 'cao', raca: 'Pastor Alemão', idade: 3, sexo: 'macho', status: 'disponivel', castrado: true, vacinado: true, vermifugado: true, fotos: [], observacoes: '', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', nome: 'Mimi', tipo: 'gato', raca: 'Persa', idade: 1, sexo: 'femea', status: 'disponivel', castrado: false, vacinado: true, vermifugado: true, fotos: [], observacoes: '', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', nome: 'Thor', tipo: 'cao', raca: 'Golden Retriever', idade: 4, sexo: 'macho', status: 'disponivel', castrado: true, vacinado: true, vermifugado: true, fotos: [], observacoes: '', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', nome: 'Luna', tipo: 'gato', raca: 'Siamês', idade: 2, sexo: 'femea', status: 'disponivel', castrado: true, vacinado: true, vermifugado: true, fotos: [], observacoes: '', createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Location states
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedUfId, setSelectedUfId] = useState<number | null>(null);
  const [prUfId, setPrUfId] = useState<number | null>(null);

  // Search states
  const [animalSearch, setAnimalSearch] = useState('');
  const [showAnimalResults, setShowAnimalResults] = useState(false);

  // Load UFs and Cities on mount - PR as default
  useEffect(() => {
    const loadLocations = async () => {
      setLoadingLocations(true);
      try {
        const ufsData = await locationService.getUFs();
        setUfs(ufsData);
        
        // Encontrar o Paraná e definir como default
        const parana = ufsData.find(uf => uf.acronym === 'PR');
        if (parana) {
          setPrUfId(parana.id);
          setSelectedUfId(parana.id);
          
          // Buscar cidades do Paraná
          const citiesData = await locationService.getCitiesByUF(parana.id);
          setCities(citiesData);
          
          // Definir PR como default no primeiro endereço se estiver criando
          if (!adotante) {
            form.setValue('enderecos.0.estadoId', parana.id);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar localizações:', error);
      } finally {
        setLoadingLocations(false);
      }
    };
    loadLocations();
  }, []);

  // Helper function to load cities by UF
  const loadCitiesByUF = async (ufId: number) => {
    if (!ufId) return;
    try {
      setLoadingLocations(true);
      const citiesData = await locationService.getCitiesByUF(ufId);
      setCities(citiesData);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const form = useForm<AdotanteFormData>({
    resolver: zodResolver(adotanteSchema),
    defaultValues: {
      nome: adotante?.nome || '',
      email: '', // Will be populated from contacts if exists
      dataNascimento: adotante?.dataNascimento?.toISOString().split('T')[0] || '',
      rg: adotante?.rg || '',
      cpf: adotante?.cpf || '',
      contatos: adotante?.contatos || [{ tipo: 'celular' as const, valor: '', principal: true }],
      profissao: adotante?.profissao || '',
      estadoCivil: adotante?.estadoCivil || 'solteiro',
      enderecos: adotante?.enderecos || [{ 
        rua: '', 
        bairro: '', 
        numero: '', 
        cidadeId: 0, 
        estadoId: prUfId || 0, 
        cep: '',
        city: {
          id: 0,
          name: '',
          uf: {
            id: prUfId || 0,
            name: 'Paraná',
            acronym: 'PR',
            country: 'Brasil',
          },
          ibge: 0,
        }
      }],
      diasParaContato: adotante?.diasParaContato || 30,
      proximoContato: adotante?.proximoContato,
      notificacoesAtivas: adotante?.notificacoesAtivas ?? true,
      animaisVinculados: adotante?.animaisVinculados || [],
    },
  });

  const { fields: contatosFields, append: appendContato, remove: removeContato } = useFieldArray({
    control: form.control,
    name: "contatos"
  });

  const { fields: enderecosFields, append: appendEndereco, remove: removeEndereco } = useFieldArray({
    control: form.control,
    name: "enderecos"
  });

  const isReadOnly = mode === 'view';

  const handleSubmit = (data: AdotanteFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form validation errors:', form.formState.errors);
    if (!isReadOnly) {
      onSubmit(data);
    }
  };

  const getContatoTypeLabel = (tipo: string) => {
    const labels = {
      telefone: 'Telefone',
      celular: 'Celular',
      email: 'Email',
      whatsapp: 'WhatsApp'
    };
    return labels[tipo as keyof typeof labels];
  };

  const getEnderecoTypeLabel = (tipo: string) => {
    const labels = {
      residencial: 'Residencial',
      comercial: 'Comercial',
      outro: 'Outro'
    };
    return labels[tipo as keyof typeof labels];
  };

  const getEstadoCivilLabel = (estado: string) => {
    const labels = {
      solteiro: 'Solteiro(a)',
      casado: 'Casado(a)',
      divorciado: 'Divorciado(a)',
      viuvo: 'Viúvo(a)',
      uniao_estavel: 'União Estável'
    };
    return labels[estado as keyof typeof labels];
  };

  // Filter functions
  const filteredAnimais = availableAnimais.filter(animal =>
    animal.nome.toLowerCase().includes(animalSearch.toLowerCase()) ||
    animal.raca.toLowerCase().includes(animalSearch.toLowerCase())
  );

  // Get linked items
  const getLinkedAnimais = () => {
    const linkedIds = form.watch('animaisVinculados') || [];
    return availableAnimais.filter(animal => linkedIds.includes(animal.id));
  };

  // Link/Unlink functions
  const linkAnimal = (animalId: string) => {
    const currentValues = form.getValues('animaisVinculados') || [];
    if (!currentValues.includes(animalId)) {
      form.setValue('animaisVinculados', [...currentValues, animalId]);
    }
    setAnimalSearch('');
    setShowAnimalResults(false);
  };

  const unlinkAnimal = (animalId: string) => {
    const currentValues = form.getValues('animaisVinculados') || [];
    form.setValue('animaisVinculados', currentValues.filter(id => id !== animalId));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
        console.log('Form validation failed:', errors);
      })} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isReadOnly} placeholder="email@exemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <MaskedInput 
                        mask="99.999.999-9" 
                        {...field} 
                        disabled={isReadOnly} 
                        placeholder="00.000.000-0"
                      />
                    </FormControl>
                    <FormMessage />
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
                      <MaskedInput 
                        mask="999.999.999-99" 
                        {...field} 
                        disabled={isReadOnly} 
                        placeholder="000.000.000-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="notificacoesAtivas"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        {field.value ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        Ativar notificações de contato
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Quando ativo, você será notificado para entrar em contato conforme o prazo configurado
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Contact Configuration */}
            {form.watch('notificacoesAtivas') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <FormField
                  control={form.control}
                  name="proximoContato"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data do próximo contato</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isReadOnly || !form.watch('notificacoesAtivas')}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecionar data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estadoCivil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao_estavel">União Estável</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contatos
            </CardTitle>
            <CardDescription>
              Adicione múltiplos contatos para o adotante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contatosFields.map((field, index) => (
              <Card key={field.id} className="border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">
                      Contato {index + 1}
                    </Badge>
                    {!isReadOnly && contatosFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContato(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`contatos.${index}.tipo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="telefone">Telefone</SelectItem>
                              <SelectItem value="celular">Celular</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                       control={form.control}
                       name={`contatos.${index}.valor`}
                       render={({ field }) => {
                         const contatoTipo = form.watch(`contatos.${index}.tipo`);
                         const getMask = () => {
                           if (contatoTipo === 'telefone' || contatoTipo === 'celular' || contatoTipo === 'whatsapp') {
                             return '(99) 99999-9999';
                           }
                           return '';
                         };
                         
                         return (
                           <FormItem>
                             <FormLabel>Valor</FormLabel>
                             <FormControl>
                               {getMask() ? (
                                 <MaskedInput
                                   mask={getMask()}
                                   {...field}
                                   disabled={isReadOnly}
                                   placeholder={contatoTipo === 'email' ? 'email@exemplo.com' : '(00) 00000-0000'}
                                 />
                               ) : (
                                 <Input {...field} disabled={isReadOnly} />
                               )}
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         );
                       }}
                     />
                     <FormField
                       control={form.control}
                       name={`contatos.${index}.principal`}
                       render={({ field }) => {
                         const principalCount = form.watch('contatos').filter(c => c.principal).length;
                         const canSetPrincipal = !field.value || principalCount <= 1;
                         
                         return (
                           <FormItem>
                             <FormLabel>Principal</FormLabel>
                             <FormControl>
                               <Select 
                                 onValueChange={(value) => {
                                   const newValue = value === 'true';
                                   if (newValue && principalCount > 0 && !field.value) {
                                     // Remove principal from others
                                     const currentContacts = form.getValues('contatos');
                                     const updatedContacts = currentContacts.map((contact, idx) => 
                                       idx === index ? { ...contact, principal: true } : { ...contact, principal: false }
                                     );
                                     form.setValue('contatos', updatedContacts);
                                   } else {
                                     field.onChange(newValue);
                                   }
                                 }} 
                                 value={field.value ? 'true' : 'false'}
                                 disabled={isReadOnly}
                               >
                                 <SelectTrigger>
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="true">Sim</SelectItem>
                                   <SelectItem value="false">Não</SelectItem>
                                 </SelectContent>
                               </Select>
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         );
                       }}
                     />
                  </div>
                </CardContent>
              </Card>
            ))}
            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={() => appendContato({ tipo: 'celular' as const, valor: '', principal: false })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
            <CardDescription>
              Adicione múltiplos endereços para o adotante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enderecosFields.map((field, index) => (
              <Card key={field.id} className="border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">
                      Endereço {index + 1}
                    </Badge>
                    {!isReadOnly && enderecosFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEndereco(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`enderecos.${index}.rua`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rua</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isReadOnly} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`enderecos.${index}.numero`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`enderecos.${index}.bairro`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`enderecos.${index}.estadoId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(Number(value));
                                // Clear city when state changes
                                form.setValue(`enderecos.${index}.cidadeId`, 0);
                                // Load cities for the selected state
                                loadCitiesByUF(Number(value));
                              }} 
                              value={field.value?.toString()} 
                              disabled={isReadOnly || loadingLocations}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`enderecos.${index}.cidadeId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(Number(value));
                                // Auto-select state when city is selected and store full city object
                                const selectedCity = cities.find(c => c.id === Number(value));
                                if (selectedCity) {
                                  if (!form.getValues(`enderecos.${index}.estadoId`)) {
                                    form.setValue(`enderecos.${index}.estadoId`, selectedCity.uf.id);
                                  }
                                  // Store the full city object for backend mapping
                                  form.setValue(`enderecos.${index}.city`, selectedCity);
                                }
                              }}
                              value={field.value?.toString()} 
                              disabled={isReadOnly || loadingLocations}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities
                                  ?.map((city) => (
                                    <SelectItem key={city.id} value={city.id.toString()}>
                                      {city.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                         control={form.control}
                         name={`enderecos.${index}.cep`}
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>CEP</FormLabel>
                             <FormControl>
                               <MaskedInput
                                 mask="99999-999"
                                 {...field}
                                 disabled={isReadOnly}
                                 placeholder="00000-000"
                               />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={() => appendEndereco({ 
                  rua: '', 
                  bairro: '', 
                  numero: '', 
                  cidadeId: 0, 
                  estadoId: prUfId || 0, 
                  cep: '',
                  city: {
                    id: 0,
                    name: '',
                    uf: {
                      id: prUfId || 0,
                      name: 'Paraná',
                      acronym: 'PR',
                      country: 'Brasil',
                    },
                    ibge: 0,
                  }
                })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Endereço
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Animal and Term Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Animais Vinculados
            </CardTitle>
            <CardDescription>
              Vincule animais a este adotante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Animals Section */}
            <div>
              <Label className="text-base font-medium">Animais Vinculados</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Pesquise e vincule animais a este adotante
              </p>
              
              {/* Linked Animals */}
              {getLinkedAnimais().length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Animais Vinculados Atualmente:</Label>
                  <div className="space-y-2">
                    {getLinkedAnimais().map((animal) => (
                      <div key={animal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {animal.tipo === 'cao' ? '🐕' : '🐱'}
                          </div>
                          <div>
                            <div className="font-medium">{animal.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
                            </div>
                          </div>
                        </div>
                        {!isReadOnly && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => unlinkAnimal(animal.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Animal Search */}
              {!isReadOnly && (
                <div className="relative">
                  <Label className="text-sm font-medium mb-2 block">Pesquisar e Adicionar Animal:</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou raça do animal..."
                      value={animalSearch}
                      onChange={(e) => {
                        setAnimalSearch(e.target.value);
                        setShowAnimalResults(e.target.value.length > 0);
                      }}
                      className="pl-8"
                      onFocus={() => setShowAnimalResults(animalSearch.length > 0)}
                    />
                  </div>
                  
                  {/* Animal Search Results */}
                  {showAnimalResults && animalSearch && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredAnimais.length > 0 ? (
                        filteredAnimais.map((animal) => {
                          const isLinked = getLinkedAnimais().some(linked => linked.id === animal.id);
                          return (
                            <div
                              key={animal.id}
                              className={`p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 ${
                                isLinked ? 'opacity-50' : ''
                              }`}
                              onClick={() => !isLinked && linkAnimal(animal.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-lg">
                                    {animal.tipo === 'cao' ? '🐕' : '🐱'}
                                  </div>
                                  <div>
                                    <div className="font-medium">{animal.nome}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {animal.status === 'disponivel' ? 'Disponível' : 
                                     animal.status === 'adotado' ? 'Adotado' : 'Em Processo'}
                                  </Badge>
                                  {isLinked && (
                                    <Badge variant="secondary" className="text-xs">
                                      Já Vinculado
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 text-sm text-muted-foreground text-center">
                          Nenhum animal encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isReadOnly ? 'Fechar' : 'Cancelar'}
          </Button>
          {!isReadOnly && (
            <Button type="submit">
              {mode === 'edit' ? 'Atualizar' : 'Cadastrar'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AdotanteForm;
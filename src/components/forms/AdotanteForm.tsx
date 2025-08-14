import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, User, Phone, MapPin, Calendar, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Adotante, Contato, Endereco } from '@/types';

const contatoSchema = z.object({
  tipo: z.enum(['telefone', 'celular', 'email', 'whatsapp']),
  valor: z.string().min(1, 'Contato é obrigatório'),
  principal: z.boolean(),
});

const enderecoSchema = z.object({
  rua: z.string().min(1, 'Rua é obrigatória'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório'),
  cep: z.string().min(8, 'CEP inválido'),
  tipo: z.enum(['residencial', 'comercial', 'outro']),
});

const adotanteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  rg: z.string().min(1, 'RG é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  contatos: z.array(contatoSchema).min(1, 'Pelo menos um contato é obrigatório'),
  profissao: z.string().min(1, 'Profissão é obrigatória'),
  estadoCivil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel']),
  enderecos: z.array(enderecoSchema).min(1, 'Pelo menos um endereço é obrigatório'),
  diasParaContato: z.number().min(1, 'Dias para contato deve ser maior que 0').optional(),
});

type AdotanteFormData = z.infer<typeof adotanteSchema>;

interface AdotanteFormProps {
  adotante?: Adotante;
  onSubmit: (data: AdotanteFormData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

const AdotanteForm: React.FC<AdotanteFormProps> = ({ adotante, onSubmit, onCancel, mode }) => {
  const form = useForm<AdotanteFormData>({
    resolver: zodResolver(adotanteSchema),
    defaultValues: {
      nome: adotante?.nome || '',
      dataNascimento: adotante?.dataNascimento?.toISOString().split('T')[0] || '',
      rg: adotante?.rg || '',
      cpf: adotante?.cpf || '',
      contatos: adotante?.contatos || [{ tipo: 'celular' as const, valor: '', principal: true }],
      profissao: adotante?.profissao || '',
      estadoCivil: adotante?.estadoCivil || 'solteiro',
      enderecos: adotante?.enderecos || [{ rua: '', bairro: '', numero: '', cidade: '', estado: '', cep: '', tipo: 'residencial' as const }],
      diasParaContato: adotante?.diasParaContato || 30,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
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
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diasParaContato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dias para próximo contato</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isReadOnly} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isReadOnly} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contatos.${index}.principal`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={(value) => field.onChange(value === 'true')} 
                              defaultValue={field.value ? 'true' : 'false'}
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
                      )}
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
                    <FormField
                      control={form.control}
                      name={`enderecos.${index}.tipo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Endereço</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="residencial">Residencial</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                        name={`enderecos.${index}.cidade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`enderecos.${index}.estado`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} disabled={isReadOnly} />
                            </FormControl>
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
                              <Input {...field} disabled={isReadOnly} />
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
                onClick={() => appendEndereco({ rua: '', bairro: '', numero: '', cidade: '', estado: '', cep: '', tipo: 'residencial' as const })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Endereço
              </Button>
            )}
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
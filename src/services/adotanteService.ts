import { api } from "./api";
import {
  Adopter,
  AdotanteFilters,
  CreateAdopterDto,
  FindAllAdoptersPaginated,
  MinimalAdopter,
} from "@/types/adopter";

// Backend response structure
// type BackendAdotanteProps = {
//   id: string;
//   name: string;
//   dtOfBirth: Date;
//   rg: string;
//   cpf: string;
//   email: string;
//   contacts: any[] | null;

//   activeNotification: boolean;
//   addresses: any[] | null;
//   civilState: string;
//   profession: string;
//   animals: any[] | null;
//   audit: {
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: string | null;
//   };
//   createdByUserId: string;
//   deletedByUserId: string | null;
//   dtToNotify: string | null;
//   terms: any[] | null;
//   updatedByUserId: string | null;
// }

// interface BackendAdotanteResponse {
//   props: BackendAdotanteProps;
// }

// export interface AdotanteListResponse {
//   data: Adotante[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// Helper function to map backend data to frontend Adotante type
// const mapBackendToFrontend = (backendData: BackendAdotanteProps): Adotante => {
//   return {
//     id: backendData?.id,
//     nome: backendData.name,
//     dataNascimento: new Date(backendData.dtOfBirth),
//     rg: backendData.rg,
//     cpf: backendData.cpf,
//     contatos: backendData.contacts || [],
//     profissao: backendData.profession,
//     estadoCivil: backendData.civilState as any,
//     enderecos: backendData.addresses || [],
//     status: "ativo",
//     animaisAdotados: backendData.animals || [],
//     animaisVinculados: backendData.animals?.map((a: any) => a.id) || [],
//     proximoContato: backendData.dtToNotify
//       ? new Date(backendData.dtToNotify)
//       : undefined,
//     notificacoesAtivas: backendData.activeNotification,
//     createdAt: new Date(backendData.audit.createdAt),
//     updatedAt: new Date(backendData.audit.updatedAt),
//   };
// };

// // Helper function to map frontend data to backend format
// const mapFrontendToBackend = (frontendData: any): CreateAdotanteRequest => {
//   // Map contacts to English format
//   const contacts = (frontendData.contatos || frontendData.contacts || []).map(
//     (contact: any) => ({
//       type: contact.tipo || contact.type,
//       value: contact.valor || contact.value,
//       isPrincipal: contact.principal ?? contact.isPrincipal,
//     })
//   );

//   // Map addresses to English format
//   const addresses = (
//     frontendData.enderecos ||
//     frontendData.addresses ||
//     []
//   ).map((address: any) => {
//     // Get the city object from the form data
//     const cityObj = address.city;

//     return {
//       street: address.rua || address.street,
//       neighborhood: address.bairro || address.neighborhood,
//       number: parseInt(address.numero || address.number, 10),
//       city: {
//         id: cityObj?.id || address.cidadeId || address.city?.id,
//         name: cityObj?.name || "",
//         stateUf: {
//           id: cityObj?.uf?.id || address.estadoId || 0,
//           name: cityObj?.uf?.name || "",
//           acronym: cityObj?.uf?.acronym || "",
//           country: cityObj?.uf?.country || "Brasil",
//         },
//         ibge: cityObj?.ibge || 0,
//       },
//     };
//   });

//   // Map animals IDs - only include if there are selected animals
//   const animalsIds = frontendData.animaisVinculados || frontendData.animalsIds;
//   const hasAnimals = animalsIds && animalsIds.length > 0;

//   const payload: any = {
//     name: frontendData.nome || frontendData.name,
//     email: frontendData.email || "",
//     dtOfBirth:
//       typeof frontendData.dataNascimento === "string"
//         ? frontendData.dataNascimento
//         : frontendData.dtOfBirth,
//     rg: frontendData.rg,
//     cpf: frontendData.cpf,
//     contacts: contacts.length > 0 ? contacts : null,
//     profession: frontendData.profissao || frontendData.profession,
//     civilState: frontendData.estadoCivil || frontendData.civilState,
//     addresses: addresses.length > 0 ? addresses : null,
//     dtToNotify: frontendData.proximoContato
//       ? typeof frontendData.proximoContato === "string"
//         ? frontendData.proximoContato
//         : frontendData.proximoContato.toISOString()
//       : null,
//     activeNotification:
//       frontendData.notificacoesAtivas ??
//       frontendData.activeNotification ??
//       false,
//   };

//   // Only include animalsIds if there are animals selected
//   if (hasAnimals) {
//     payload.animalsIds = animalsIds;
//   }

//   return payload;
// };

export const adotanteService = {
  // Listar adotantes com filtros e paginação
  list: async (
    filters?: AdotanteFilters,
    page = 1,
    limit = 100
  ): Promise<FindAllAdoptersPaginated> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    params.append("page", String(page));
    params.append("limit", String(limit));

    const response = await api.get<FindAllAdoptersPaginated>(
      `/api/adopter/v1?${params.toString()}`
    );

    return {
      items: response.data.items,
      meta: {
        currentPage: response.data.meta.currentPage,
        totalPages: response.data.meta.totalPages,
        itemsPerPage: response.data.meta.itemsPerPage,
        totalItems: response.data.meta.totalItems,
        itemCount: response.data.meta.itemCount,
      },
    };
  },

  // Buscar adotante por ID
  getById: async (id: string): Promise<Adopter> => {
    const response = await api.get<Adopter>(`/api/adopter/v1/${id}`);
    return response.data;
  },

  // Criar novo adotante
  create: async (data: CreateAdopterDto): Promise<Adopter> => {
    // const backendData = mapFrontendToBackend(data);
    console.log(data);
    const response = await api.post<Adopter>("/api/adopter/v1", data);
    return response.data;
  },

  // Atualizar adotante
  update: async (id: string, data: Adopter): Promise<Adopter> => {
    // const backendData = mapFrontendToBackend(data);
    const response = await api.put<Adopter>(`/api/adopter/v1/${id}`, data);
    return response.data;
  },

  // Deletar adotante
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/adopter/v1/${id}`);
  },

  // Buscar adotantes por nome ou CPF
  search: async (query: string): Promise<MinimalAdopter[]> => {
    const response = await api.get<FindAllAdoptersPaginated>(
      `/api/adopter/v1?search=${encodeURIComponent(query)}`
    );
    return response.data.items;
  },
};

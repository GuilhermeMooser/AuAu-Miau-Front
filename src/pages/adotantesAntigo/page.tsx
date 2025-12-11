// import {
//   Users,
//   Plus,
//   Search,
//   Filter,
//   Mail,
//   Phone,
//   Clock,
//   Edit,
//   Eye,
//   Calendar,
// } from "lucide-react";
// import { useAdotantes } from "./useAdotantes";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Badge } from "../../components/ui/badge";
// import AdotanteFilters from "../../components/forms/Adopter/AdotanteFilters";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import AdotanteForm from "../../components/forms/Adopter/AdotanteForm";
// import { formatDate } from "@/utils/formatDate";
// import { formatCPF, formatPhoneNumber } from "@/utils/format";

// const AdotantesPage = () => {
//   const {
//     showCreateModal,
//     setShowCreateModal,
//     showEditModal,
//     setShowEditModal,
//     showViewModal,
//     setShowViewModal,
//     showFilters,
//     setShowFilters,
//     selectedMinimalAdotante,
//     setSelectedMinimalAdotante,
//     selectedAdotante,
//     setSelectedAdotante,
//     filters,
//     setFilters,
//     searchTerm,
//     setSearchTerm,
//     adotantes,
//     handleCreateAdotante,
//     handleEditAdotante,
//     handleViewAdopter,
//     handleEditClick,
//     handleApplyFilters,
//     handleClearFilters,
//     getStatusColor,
//     getPrimaryContact,
//     getPrimaryAddress,
//     isContactDue,
//     getDaysUntilContact,
//   } = useAdotantes();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="min-w-0">
//           <h1 className="text-2xl md:text-3xl font-bold text-foreground">
//             Adotantes
//           </h1>
//           <p className="text-sm md:text-base text-muted-foreground">
//             Gerencie todos os adotantes cadastrados
//           </p>
//         </div>
//         <Button
//           className="shadow-glow w-full sm:w-auto"
//           onClick={() => setShowCreateModal(true)}
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           <span className="hidden sm:inline">Cadastrar Adotante</span>
//           <span className="sm:hidden">Cadastrar</span>
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
//         <div className="flex-1 max-w-full sm:max-w-md">
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Buscar por nome, email, CPF..."
//               className="pl-8 bg-background"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//         <Button
//           variant="outline"
//           className="w-full sm:w-auto"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           <Filter className="mr-2 h-4 w-4" />
//           Filtros
//           {Object.keys(filters).length > 0 && (
//             <Badge variant="secondary" className="ml-2">
//               {Object.keys(filters).length}
//             </Badge>
//           )}
//         </Button>
//       </div>

//       {/* Filters */}
//       {showFilters && (
//         <AdotanteFilters
//           onApplyFilters={handleApplyFilters}
//           onClearFilters={handleClearFilters}
//           activeFilters={filters}
//         />
//       )}

//       {/* Adopters Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//         {adotantes.map((adotante) => {
//           const primaryContact = getPrimaryContact(adotante.contacts);
//           const primaryAddress = getPrimaryAddress(adotante.addresses);
//           const daysUntilContact = getDaysUntilContact(adotante.dtToNotify);
//           const contactDue = isContactDue(adotante.dtToNotify);

//           const MAX_ANIMALS_TO_SHOW = 3;
//           const animals = adotante?.animals ?? [];
//           const visibleAnimals = animals.slice(0, MAX_ANIMALS_TO_SHOW);
//           const remainingCount = animals.length - MAX_ANIMALS_TO_SHOW;

//           return (
//             <Card
//               key={adotante.id}
//               className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
//             >
//               <CardHeader className="flex-shrink-0">
//                 <div className="flex flex-col">
//                   <div className="flex items-center justify-between mb-1">
//                     <CardTitle className="text-xl text-foreground">
//                       {adotante.name}
//                     </CardTitle>

//                     <Badge
//                       className={`${
//                         adotante.audit.deletedAt === null
//                           ? "bg-success text-success-foreground"
//                           : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       {adotante.audit.deletedAt === null ? "Ativo" : "Inativo"}
//                     </Badge>
//                   </div>

//                   {/* Espaço reservado para o badge de contato vencido - sempre ocupa espaço */}
//                   <div className="flex items-center justify-end h-6">
//                     {contactDue && adotante.activeNotification && (
//                       <Badge variant="destructive" className="text-xs">
//                         <Clock className="h-3 w-3 mr-1" />
//                         Contato Vencido
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//                 <CardDescription>
//                   Cadastrado em {formatDate(adotante.audit.createdAt)}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex-grow flex flex-col">
//                 <div className="space-y-4 flex-grow flex flex-col">
//                   {/* Profile icon - altura fixa */}
//                   <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Users className="h-16 w-16 text-white opacity-50" />
//                   </div>

//                   {/* Contact info - altura fixa */}
//                   <div className="space-y-2 flex-shrink-0">
//                     <div className="flex items-center space-x-2 text-sm">
//                       <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                       <span className="text-foreground truncate">
//                         {adotante.email}
//                       </span>
//                     </div>
//                     {/* Espaço reservado para telefone - sempre ocupa espaço */}
//                     <div className="flex items-center space-x-2 text-sm h-5">
//                       {(primaryContact?.type === "telefone" ||
//                         primaryContact?.type === "celular" ||
//                         primaryContact?.type === "whatsapp") && (
//                         <>
//                           <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                           <span className="text-foreground">
//                             {formatPhoneNumber(primaryContact.value)}
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Basic info - altura fixa */}
//                   <div className="space-y-1 text-sm flex-shrink-0">
//                     <div>
//                       <span className="text-muted-foreground">CPF: </span>
//                       <span className="text-foreground">
//                         {formatCPF(adotante.cpf)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Location - altura fixa */}
//                   <div className="text-sm flex-shrink-0 h-5">
//                     {primaryAddress && (
//                       <>
//                         <span className="text-muted-foreground">
//                           Localização:{" "}
//                         </span>
//                         <span className="text-foreground">
//                           {primaryAddress.city.name},{" "}
//                           {primaryAddress.city.stateUf.acronym}
//                         </span>
//                       </>
//                     )}
//                   </div>

//                   {/* Próximo contato - altura fixa */}
//                   <div className="text-sm flex-shrink-0 min-h-[3rem]">
//                     {adotante.activeNotification && adotante.dtToNotify ? (
//                       <>
//                         <span className="text-muted-foreground">
//                           Próximo contato:{" "}
//                         </span>
//                         <span
//                           className={`${
//                             contactDue
//                               ? "text-destructive font-medium"
//                               : "text-foreground"
//                           }`}
//                         >
//                           {formatDate(adotante.dtToNotify)}
//                           {daysUntilContact && (
//                             <span className="ml-1 text-muted-foreground">
//                               (
//                               {daysUntilContact > 0
//                                 ? `em ${daysUntilContact} dias`
//                                 : daysUntilContact === 0
//                                 ? "hoje"
//                                 : `venceu há ${Math.abs(
//                                     daysUntilContact
//                                   )} dias`}
//                               )
//                             </span>
//                           )}
//                         </span>
//                       </>
//                     ) : (
//                       <Badge variant="outline" className="text-xs">
//                         Notificações Desativadas
//                       </Badge>
//                     )}
//                   </div>

//                   {/* Animais - altura fixa */}
//                   <div className="flex-shrink-0 min-h-[4rem]">
//                     <p className="text-sm text-muted-foreground mb-1">
//                       Animais adotados ({animals.length})
//                     </p>
//                     {animals.length > 0 ? (
//                       <div className="flex flex-wrap gap-1 items-center">
//                         {visibleAnimals.map((animal, index) => (
//                           <Badge
//                             key={index}
//                             variant="outline"
//                             className="text-xs"
//                           >
//                             {animal.name}
//                           </Badge>
//                         ))}
//                         {remainingCount > 0 && (
//                           <span className="text-xs text-muted-foreground">
//                             +{remainingCount} outros
//                           </span>
//                         )}
//                       </div>
//                     ) : (
//                       <p className="text-xs text-muted-foreground">
//                         Nenhum animal adotado
//                       </p>
//                     )}
//                   </div>

//                   {/* Actions - sempre no final */}
//                   <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() => handleEditClick(adotante)}
//                     >
//                       <Edit className="h-3 w-3 sm:mr-1" />
//                       <span className="hidden sm:inline ml-1">Editar</span>
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       className="flex-1"
//                       // onClick={() => handleViewAdopter(adotante)}
//                     >
//                       <Eye className="h-3 w-3 sm:mr-1" />
//                       <span className="hidden sm:inline ml-1">
//                         Ver Detalhes
//                       </span>
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Empty state */}
//       {adotantes.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-foreground mb-2">
//             Nenhum adotante encontrado
//           </h3>
//           <p className="text-muted-foreground mb-4">
//             Comece cadastrando o primeiro adotante
//           </p>
//           <Button onClick={() => setShowCreateModal(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             Cadastrar Primeiro Adotante
//           </Button>
//         </div>
//       )}

//       {/* Create Modal */}
//       <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
//           <DialogHeader>
//             <DialogTitle>Cadastrar Novo Adotante</DialogTitle>
//           </DialogHeader>
//           <AdotanteForm
//             mode="create"
//             onSubmit={handleCreateAdotante}
//             onCancel={() => setShowCreateModal(false)}
//           />
//         </DialogContent>
//       </Dialog>
//       {/* Edit Modal */}
//       <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
//           <DialogHeader>
//             <DialogTitle>Editar Adotante</DialogTitle>
//           </DialogHeader>
//           <AdotanteForm
//             mode="edit"
//             adopter={selectedAdotante}
//             onSubmit={handleEditAdotante}
//             onCancel={() => {
//               setShowEditModal(false);
//               setSelectedAdotante(undefined);
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* View Modal */}
//       <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
//           <DialogHeader>
//             <DialogTitle>Detalhes do Adotante</DialogTitle>
//           </DialogHeader>
//           <AdotanteForm
//             mode="view"
//             adopter={selectedAdotante}
//             onSubmit={() => {}}
//             onCancel={() => {
//               setShowViewModal(false);
//               setSelectedAdotante(undefined);
//             }}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdotantesPage;

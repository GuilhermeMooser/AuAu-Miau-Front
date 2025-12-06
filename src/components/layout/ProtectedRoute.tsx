// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { Loader2 } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRole?: 'admin' | 'user';
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
//   children, 
//   requiredRole 
// }) => {
//   const { isAuthenticated, user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
//           <p className="text-muted-foreground">Verificando autenticação...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-4">
//         <div className="text-center space-y-4">
//           <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
//           <p className="text-muted-foreground">
//             Você não tem permissão para acessar esta página.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
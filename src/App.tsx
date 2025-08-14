import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider } from "@/contexts/AuthContext";

// Components
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Animais from "./pages/Animais";
import Adotantes from "./pages/Adotantes";
import Termos from "./pages/Termos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/animais" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Animais />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/adotantes" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Adotantes />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/termos" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Termos />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="/contabilidade" element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-foreground">Contabilidade</h1>
                    <p className="text-muted-foreground">Módulo em desenvolvimento...</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios" element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
                    <p className="text-muted-foreground">Módulo em desenvolvimento...</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

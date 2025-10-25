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
import AnimaisPage from "./pages/animais/page";
import AdotantesPage from "./pages/adotantes/page";
import Termos from "./pages/Termos";
import NotFound from "./pages/NotFound";
import queryClient from "./lib/queryClient";



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
            
            {/* Routes - Authentication disabled for development */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            
            <Route path="/animais" element={
              <DashboardLayout>
                <AnimaisPage />
              </DashboardLayout>
            } />
            
            <Route path="/adotantes" element={
              <DashboardLayout>
                <AdotantesPage />
              </DashboardLayout>
            } />
            
            <Route path="/termos" element={
              <DashboardLayout>
                <Termos />
              </DashboardLayout>
            } />
            
            {/* Admin routes */}
            <Route path="/contabilidade" element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-foreground">Contabilidade</h1>
                  <p className="text-muted-foreground">Módulo em desenvolvimento...</p>
                </div>
              </DashboardLayout>
            } />
            
            <Route path="/usuarios" element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
                  <p className="text-muted-foreground">Módulo em desenvolvimento...</p>
                </div>
              </DashboardLayout>
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

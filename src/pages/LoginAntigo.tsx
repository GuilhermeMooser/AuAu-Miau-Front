import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import { Heart, Shield, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types';

const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginTeste = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await login(data as LoginRequest);
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Do Auau ao Miau
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sistema de Gerenciamento ONG
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-card rounded-lg p-2 sm:p-4 text-center border border-border">
            <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-xs text-muted-foreground">Seguro</p>
          </div>
          <div className="bg-gradient-card rounded-lg p-2 sm:p-4 text-center border border-border">
            <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-xs text-muted-foreground">Colaborativo</p>
          </div>
          <div className="bg-gradient-card rounded-lg p-2 sm:p-4 text-center border border-border">
            <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-xs text-muted-foreground">Com Amor</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-card border-border shadow-large">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  {...register('username')}
                  className="bg-background border-border"
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password')}
                  className="bg-background border-border"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                loadingText="Entrando..."
              >
                Entrar
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Credenciais de demonstração:
              </p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Usuário:</strong> user / user123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
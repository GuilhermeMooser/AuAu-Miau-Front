import { MinimalUser } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Mail, User } from "lucide-react";
import { formatCPF } from "@/utils/format";
import { Role } from "@/constants/roles";
import { Button } from "@/components/ui/button";

export type UserCardProps = {
  user: MinimalUser;
  handleEditClick: (user: MinimalUser) => void;
  handleViewUser: (user: MinimalUser) => void;
};

export default function UserCard({
  user,
  handleEditClick,
  handleViewUser,
}: UserCardProps) {
  return (
    <Card
      key={user.id}
      className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all flex flex-col h-full"
    >
      <CardHeader className="flex-shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <CardTitle className="text-xl text-foreground">
              {user.name}
            </CardTitle>

            <Badge
              className={`${
                user.audit.deletedAt === null && user.active
                  ? "bg-success text-success-foreground"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {user.audit.deletedAt === null && user.active
                ? "Ativo"
                : "Inativo"}
            </Badge>
          </div>
        </div>
        <CardDescription>
          Cadastrado em {formatDate(user.audit.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-4 flex-grow flex flex-col">
          <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="h-16 w-16 text-white opacity-50" />
          </div>
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Cargo: </span>
              <Badge
                className={`${
                  user.role.name === Role.Admin
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {user.role.name === Role.Admin ? "Administrador" : "Voluntário"}
              </Badge>
            </div>
          </div>
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate">{user.email}</span>
            </div>
          </div>
          <div className="space-y-1 text-sm flex-shrink-0">
            <div>
              <span className="text-muted-foreground">CPF: </span>
              <span className="text-foreground">{formatCPF(user.cpf)}</span>
            </div>
          </div>
          {/* Actions - sempre no final */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleEditClick(user)}
            >
              <Edit className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline ml-1">Editar</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => handleViewUser(user)}
            >
              <Eye className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline ml-1">Ver Detalhes</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { User } from "@/types";
import { useUserForm } from "./useUserForm"

type UserFormProps = {
    adopter?: User;
    onCancel: () => void;
    mode: "create" | "edit" | "view";
    onCreateSuccess?: (newUser: User) => void;
    onUpdateSuccess?: (updatedUser: User) => void;
    onDeleteSuccess?: (deletedId: string) => void;
}

export default function UserForm({}: UserFormProps) {

    const {} = useUserForm()


    return ()
}
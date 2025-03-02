export interface CreateUserI {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    phoneNumber?: string;
}

export interface UpdateUserI {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export interface UserResponseI{
    id: number;
    email: string | null;
    phoneNumber?: string | null;
    firstName?: string| null;
    lastName?: string | null;
    createdA?: Date;
    updatedAt?: Date;
}
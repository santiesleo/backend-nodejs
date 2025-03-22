// Interfaz para crear un usuario
export interface UserInput {
    id: number
    name: string,
    email: string, 
    password: string
}

// Interfaz para actualizar un usuario
export interface UserInputUpdate {
    name: string,
    email: string
}

// Interfaz para iniciar sesión
export interface UserLogin {
    email: string, 
    password: string
}

// Interfaz para la respuesta del login
export interface UserLoginResponse {
    user: {
        id: number,  
        name: string,
        email: string,
        roles: string[],
        token: string
    }
}

// Interfaz para el modelo completo (opcional, útil para tipado)
export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
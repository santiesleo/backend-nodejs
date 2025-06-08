import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models";
import { UserInput, UserInputUpdate, UserLogin, UserLoginResponse } from "../interfaces";
import { AuthError } from "../exceptions";

class UserService {

    public async create(userInput: UserInput): Promise<User> {
        const userExists: User | null = await this.findByEmail(userInput.email);
        if (userExists != null) {
            throw new ReferenceError("User already exists");
        }
        
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(userInput.password, 10);
        
        // Crear una nueva instancia del modelo y luego guardarla
        const user = User.build({
            email: userInput.email,
            password: hashedPassword,
            name: userInput.name || "Default Name"
        });
        
        await user.save();
        return user;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({ where: { email } });
        return user;
    }

    public async findAll(): Promise<User[]> {
        const users: User[] = await User.findAll();
        return users;
    }

    public async findById(id: string): Promise<User | null> {
        const user: User | null = await User.findByPk(id);
        return user;
    }

    public async update(id: string, userInput: UserInputUpdate): Promise<User | null> {
        const [, [user]] = await User.update(userInput, { 
            where: { id }, 
            returning: true 
        });
        if (user) {
            user.password = "";
        }
        return user;
    }

    public async delete(id: string): Promise<User | null> {
        const user: User | null = await User.findByPk(id);
        if (user) {
            await user.destroy();
        }
        return user;
    }
    
    public async login(userLogin: UserLogin): Promise<UserLoginResponse> {
        const userExists: User | null = await this.findByEmail(userLogin.email);
        if (userExists === null) {
            throw new AuthError("Not Authorized");
        }
        
        const isMatch: boolean = await bcrypt.compare(userLogin.password, userExists.password);
        if (!isMatch) {
            throw new AuthError("Not Authorized");
        }
        
        // Lista de correos que tendrán rol de admin
        const adminEmails = ['admin@example.com', 'santiago@ejemplo.com'];
        
        // Determinar roles basado en el email
        const roles = adminEmails.includes(userExists.email) ? ["admin"] : [];
        
        return {
            user: {
                id: userExists.id,
                name: userExists.name,
                email: userExists.email,
                roles: roles,
                token: this.generateToken(userExists)
            }
        };
    }

    public generateToken(user: User): string {
        return jwt.sign({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        },
        process.env.JWT_SECRET || "secret", 
        { expiresIn: "10m" });
    }
}

export const userService = new UserService();
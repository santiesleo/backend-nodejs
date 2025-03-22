import { User } from "../models";
import { UserInput, UserInputUpdate, UserLogin, UserLoginResponse } from "../interfaces";
import { AuthError } from "../exceptions";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {

    public async create(userInput: UserInput): Promise<User> {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    public  async findByEmail(email: string): Promise<User | null>{
        try {
            const user = await User.findOne({where: {email}});
            return user;
        } catch (error) {
            throw error;
        }
    }

    public  async findAll(): Promise<User[]>{
        try {
            const users: User[] = await User.findAll();
            return users;
        } catch (error) {
            throw error;
        }
    }

    public  async findById(id: string): Promise<User | null>{
        try {
            const user: User | null = await User.findByPk(id);
            return user;
        } catch (error) {
            throw error;
        }
    }    

    public  async update(id: string, userInput: UserInputUpdate): Promise<User | null>{
        try {
            const [rowsUpdated, [user]] = await User.update(userInput, { where: { id }, returning: true });
            if(user)
                user.password = "";
            return user;
        } catch (error) {
            throw error;
        }
    }

    public  async delete(id: string): Promise<User | null>{
        try {
            const user: User | null = await User.findByPk(id);
            if(user){
                await user.destroy();   
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
    
    public async login(userLogin: UserLogin): Promise<UserLoginResponse | undefined>{
        try {
            const userExists: User | null = await this.findByEmail(userLogin.email);
            if (userExists === null){
                throw new AuthError("Not Authorized");
            }
            const isMatch: boolean = await bcrypt.compare(userLogin.password, userExists.password);  
            if (!isMatch){
                throw new AuthError("Not Authorized");
                console.log("No hacen match");
            }
            return {
                user:{
                    id: userExists.id,
                    name: userExists.name,
                    email: userExists.email,
                    roles: ["admin"], 
                    token: this.generateToken(userExists)
                }
            }
        } catch (error) {
            throw error;
        }

    }

    public generateToken(user: User): string {
        try {
            return jwt.sign({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }},
                process.env.JWT_SECRET || "secret", 
                {expiresIn: "10m"});
        } catch (error) {
            throw error;
        }
    }

}

export const userService = new UserService();
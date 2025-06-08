import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

// Tipo para el payload del JWT
interface JwtPayload {
    user: {
        id: number;
        email: string;
        name: string;
    };
    iat?: number;
    exp?: number;
}

// Interfaz para extender el Request
interface AuthenticatedRequest extends Request {
    body: {
        loggedUser?: JwtPayload;
        [key: string]: unknown;
    };
}

export const productAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    let token: string | undefined = req.header("Authorization"); 
    
    if (!token) {
        res.status(401).json("Not Authorized");
        return;
    }
    
    try {
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
        req.body.loggedUser = decoded;
        
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json("Token Expired");
            return;
        }
        res.status(401).json("Not Authorized");
    }
};
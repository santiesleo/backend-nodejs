import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const productAuth = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.header("Authorization"); 
    
    if(!token){
        return res.status(401).json("Not Authorized");
    }
    
    try {
        token = token.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.body.loggedUser = decoded;
        
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError){
            return res.status(401).json("Token Expired");
        }
        return res.status(401).json("Not Authorized");
    }
}
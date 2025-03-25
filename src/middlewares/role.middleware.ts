import { Request, Response, NextFunction } from "express";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Si no tiene usuario logueado
  if (!req.body.loggedUser) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  const userEmail = req.body.loggedUser.user.email;
  const adminEmails = ['admin@example.com', 'santiago@ejemplo.com'];
  
  if (!adminEmails.includes(userEmail)) {
    return res.status(403).json({ message: "Forbidden: Insufficient permission" });
  }

  // Si tiene permiso, continuar
  next();
};


export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Si no tiene usuario logueado
    if (!req.body.loggedUser) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    const userRoles = req.body.loggedUser.user.roles || [];
    
    // Si el usuario tiene uno de los roles permitidos
    const hasPermission = roles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden: Insufficient permission" });
    }

    // Si tiene permiso, continuar
    next();
  };
};
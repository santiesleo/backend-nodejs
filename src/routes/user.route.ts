import { Router } from "express";
import { userController } from "../controllers";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { userSchema } from "../schemas";
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rutas REST (mantenidas para compatibilidad durante la migración a GraphQL)
router.get("/", userController.getAll);
router.post("/", validateSchema(userSchema), userController.create);
router.get("/profile", authMiddleware, userController.get);
router.get("/:id", userController.get);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);
router.post("/login", userController.login);

/*
userRouter.get("/", (req: Request, res: Response) => {
    res.send("Get all users");
})*/

export const userRouter = router;